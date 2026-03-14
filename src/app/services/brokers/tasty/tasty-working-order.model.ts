import {IWorkingOrderViewModel} from "../interfaces/working-order.interfaces";
import {ITastyOrderRawData} from "./raw-data/tasty-order.raw-data.interfaces";
import TastyTradeClient from "@tastytrade/api";
import {IAppServiceFactory} from "../../app-service-factory.interface";
import {AppLocalStorageKeys} from "../../storage/app-local-storage-keys";
import {Check} from "../../../../framework/utils/type-checking";
import {TimeSpan} from "../../../../framework/types/time-span";
import {NullableNumber} from "../../../../framework/types/nullable-types";
import {GobyOrderSource} from "../goby-order-source";
import {Lazy} from "../../../../framework/utils/lazy";

export const WORKING_ORDERS_MAX_REPLACE_TIME_INTERVAL = TimeSpan.fromSeconds(10);
const WORKING_ORDER_REPLACE_TIME_LIMIT = TimeSpan.fromSeconds(20);


export class TastyWorkingOrderModel implements IWorkingOrderViewModel {
    constructor(private readonly tastyOrderRawData: ITastyOrderRawData,
                private readonly tastyClient: TastyTradeClient,
                private readonly services: IAppServiceFactory) {
        this._gobySource = GobyOrderSource.tryParse(tastyOrderRawData.source);
        this._replaceAttemptsStorageHandler = new Lazy<ReplaceAttemptsStorageHandler>(() => new ReplaceAttemptsStorageHandler(tastyOrderRawData, services));
        if(this._gobySource) {
            this._replaceAttemptsStorageHandler.forceInit();
        }
    }

    private readonly _replaceAttemptsStorageHandler: Lazy<ReplaceAttemptsStorageHandler>;
    private _gobySource: GobyOrderSource | null = null;

    get id(): string {
        return this.tastyOrderRawData.id.toString();
    }

    private get orderIdAsNumber() {
        return this.tastyOrderRawData.id;
    }

    getReplaceAttemptStorageDiscriminator(): string {
        return this._replaceAttemptsStorageHandler.value.getStorageDiscriminator().discriminator;
    }

    get underlyingSymbol(): string {
        return this.tastyOrderRawData.underlyingSymbol;
    }

    get tradingPrice(): number {
        return parseFloat(this.tastyOrderRawData.price);
    }

    get isGobyOrder(): boolean {
        return Boolean(this._gobySource);
    }

    private get accountNumber(): string {
        return this.tastyOrderRawData.accountNumber;
    }

    private get numberOfReplaceAttempts(): number {
        return this._gobySource?.replaceAttempts ?? 0;
    }

    public  async cancel(): Promise<void> {
        try {
            await this.tastyClient.orderService.cancelOrder(this.accountNumber, this.orderIdAsNumber);
        } catch (err) {
            await this.services.toaster.showErrorToast({
                renderContent: () => this.services.language.translate(`Failed to cancel order! ${err}`)
            });
        }
    }

    async replace(): Promise<void> {
        if(!this._gobySource) {
            return;
        }

        try {

            //VITE_IGNORE_LIVE_STATUS_FOR_WORKING_ORDER is here in order to be able to test the logic in development while the market is closed.
            if(this.tastyOrderRawData.status !== "Live" && import.meta.env.VITE_IGNORE_LIVE_STATUS_FOR_WORKING_ORDER !== 'true') {
                this._replaceAttemptsStorageHandler.value.setLastAttemptTime();
                return;
            }

            if((this.services.time.currentDate.getTime() - this._replaceAttemptsStorageHandler.value.lastAttemptTime) < WORKING_ORDER_REPLACE_TIME_LIMIT.totalMilliseconds) {
                return;
            }

            const newPrice = await this._getPriceForReplace();

            if(Check.isNullOrUndefined(newPrice)) {
                return;
            }


            this._gobySource = this._gobySource.withReplaceAttempts(this.numberOfReplaceAttempts + 1);

            await this.tastyClient.orderService.replaceOrder(this.accountNumber, this.orderIdAsNumber, {
                "order-type": this.tastyOrderRawData.orderType,
                "time-in-force": this.tastyOrderRawData.timeInForce,
                "price": newPrice,
                "price-effect": this.tastyOrderRawData.priceEffect,
                "source": this._gobySource.toString(),
                "legs": this.tastyOrderRawData.legs.map(leg => {
                    return {
                        "action": leg.action,
                        "instrument-type": leg.instrumentType,
                        "quantity": leg.quantity,
                        "symbol": leg.symbol
                    }
                })
            });
        } catch (err) {
            this.services.logger.error('Failed to replace order', err);
            await this.services.toaster.showErrorToast({
                renderContent: () => this.services.language.translate(`Failed to replace order! ${err}`)
            });
        }
    }

    private async _getPriceForReplace(): Promise<NullableNumber> {


        const tickerInfo = await this.services.tickers.getTicker(this.underlyingSymbol).getInfoAsync();

        const tickSize = tickerInfo.getOptionTickSize(this.tradingPrice);

        let maxAttempts: number;

        if(tickSize === 0.01) {
            maxAttempts = 4;
        } else if(tickSize === 0.02) {
            maxAttempts = 2;
        } else {
            maxAttempts = 1;
        }

        if(this.numberOfReplaceAttempts >= maxAttempts) {
            return null;
        }

        if(this.tastyOrderRawData.priceEffect === "Credit") {
            return this.tradingPrice - tickSize; //make it a little bit cheaper to get filled
        } else if(this.tastyOrderRawData.priceEffect === "Debit") {
            return  this.tradingPrice + tickSize; //make it a little bit expensive to get filled
        } else {
            this.services.logger.error('Unexpected price effect', this.tastyOrderRawData.priceEffect);
            return null;
        }
    }


}

interface IReplaceAttemptStorageData {
    lastAttemptTime: number;
}

class ReplaceAttemptsStorageHandler {
    constructor(private readonly tastyOrderRawData: ITastyOrderRawData,
                private readonly services: IAppServiceFactory) {
        this.setLastAttemptTime();
    }

    get lastAttemptTime(): number {
        const replaceAttempts = this._getStorageData();
        if(Check.isNullOrUndefined(replaceAttempts)) {
            return this.services.time.currentDate.getTime();
        }

        return replaceAttempts.lastAttemptTime;
    }

    setLastAttemptTime(): void {
        const replaceAttempts = this._getStorageData();
        this._setStorageData({
            ...replaceAttempts,
            lastAttemptTime: this.services.time.currentDate.getTime()
        });

    }

    getStorageDiscriminator(): {discriminator: string} {
        return {
            discriminator: `Tasty.${this.tastyOrderRawData.accountNumber}.${this.tastyOrderRawData.id.toString()}`
        }
    }

    private _getStorageData(): IReplaceAttemptStorageData | null {
        return this.services.localStorage.getJson<IReplaceAttemptStorageData>(AppLocalStorageKeys.orderReplaceAttempts,
                                                  this.getStorageDiscriminator());
    }

    private _setStorageData(data: IReplaceAttemptStorageData): void {
        this.services.localStorage.setJson(AppLocalStorageKeys.orderReplaceAttempts, data, this.getStorageDiscriminator());
    }

}