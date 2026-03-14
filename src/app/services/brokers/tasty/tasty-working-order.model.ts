import {IWorkingOrderViewModel} from "../interfaces/working-order.interfaces";
import {ITastyOrderRawData} from "./raw-data/tasty-order.raw-data.interfaces";
import {ORDERS_SOURCE_NAME} from "../constants";
import TastyTradeClient from "@tastytrade/api";
import {IAppServiceFactory} from "../../app-service-factory.interface";
import {AppLocalStorageKeys} from "../../storage/app-local-storage-keys";
import {Check} from "../../../../framework/utils/type-checking";
import {TimeSpan} from "../../../../framework/types/time-span";

export const WORKING_ORDERS_MAX_REPLACE_INTERVAL = TimeSpan.fromSeconds(10);
const WORKING_ORDER_REPLACE_TIME_LIMIT = TimeSpan.fromSeconds(20);
const WORKING_ORDER_REPLACE_ATTEMPTS_LIMIT = 3;

export class TastyWorkingOrderModel implements IWorkingOrderViewModel {
    constructor(private readonly tastyOrderRawData: ITastyOrderRawData,
                private readonly tastyClient: TastyTradeClient,
                private readonly services: IAppServiceFactory) {
        this._replaceAttemptsStorageHandler = new ReplaceAttemptsStorageHandler(tastyOrderRawData, services);
    }



    private readonly _replaceAttemptsStorageHandler: ReplaceAttemptsStorageHandler;

    get id(): string {
        return this.tastyOrderRawData.id.toString();
    }

    private get orderIdAsNumber() {
        return this.tastyOrderRawData.id;
    }

    get underlyingSymbol(): string {
        return this.tastyOrderRawData.underlyingSymbol;
    }

    get tradingPrice(): number {
        return parseFloat(this.tastyOrderRawData.price);
    }

    get isGobyOrder(): boolean {
        return this.tastyOrderRawData.source === ORDERS_SOURCE_NAME;
    }

    private get accountNumber(): string {
        return this.tastyOrderRawData.accountNumber;
    }

    async replace(): Promise<void> {
        if(!this.isGobyOrder) {
            return;
        }

        if(this._replaceAttemptsStorageHandler.numberOfReplaceAttempts >= WORKING_ORDER_REPLACE_ATTEMPTS_LIMIT) {
            return;
        }

        if((this.services.time.currentDate.getTime() - this._replaceAttemptsStorageHandler.lastAttemptTime) < WORKING_ORDER_REPLACE_TIME_LIMIT.totalMilliseconds) {
            return;
        }

        this._replaceAttemptsStorageHandler.numberOfReplaceAttempts++;

        let newPrice = this.tradingPrice;
        if(this.tastyOrderRawData.priceEffect === "Credit") {
            newPrice = this.tradingPrice - 0.01; //make it a little bit cheaper to get filled
        } else if(this.tastyOrderRawData.priceEffect === "Debit") {
            newPrice = this.tradingPrice + 0.01; //make it a little bit expensive to get filled
        }

        console.log(`Replacing order ${this.id} with ${newPrice}`);

        try {
            await this.tastyClient.orderService.replaceOrder(this.accountNumber, this.orderIdAsNumber, {
                "order-type": this.tastyOrderRawData.orderType,
                "time-in-force": this.tastyOrderRawData.timeInForce,
                "price": newPrice,
                "price-effect": this.tastyOrderRawData.priceEffect,
                "source": this.tastyOrderRawData.source,
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
            console.error(err);
            await this.services.toaster.showErrorToast({
                renderContent: () => this.services.language.translate(`Failed to replace order! ${err}`)
            });
        }

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
}

interface IReplaceAttemptStorageData {
    count: number;
    lastAttemptTime: number;
}

class ReplaceAttemptsStorageHandler {
    constructor(private readonly tastyOrderRawData: ITastyOrderRawData,
                private readonly services: IAppServiceFactory) {
        this._replaceStorageKey();
    }

    get lastAttemptTime(): number {
        const replaceAttempts = this._getReplaceAttemptStorageData();
        if(Check.isNullOrUndefined(replaceAttempts)) {
            return 0;
        }

        return replaceAttempts.lastAttemptTime;
    }


    get numberOfReplaceAttempts(): number {
        const replaceAttempts = this._getReplaceAttemptStorageData();
        if(Check.isNullOrUndefined(replaceAttempts)) {
            return 0;
        }

        return replaceAttempts.count;

    }


    set numberOfReplaceAttempts(value: number) {
        this.services.localStorage.setJson(AppLocalStorageKeys.orderReplaceAttemptCount, {
            count: value,
            lastAttemptTime: Date.now()
        }, this._getLocalStorageDiscriminator());
    }

    private _getLocalStorageDiscriminator(orderId?: string): {discriminator: string} {
        return {
            discriminator: `Tasty.${this.tastyOrderRawData.accountNumber}.${orderId ?? this.tastyOrderRawData.id.toString()}`
        }
    }

    private _getReplaceAttemptStorageData(orderId?: string): IReplaceAttemptStorageData | null {
        return this.services.localStorage.getJson<IReplaceAttemptStorageData>(AppLocalStorageKeys.orderReplaceAttemptCount,
                                                  this._getLocalStorageDiscriminator(orderId));
    }

    private _replaceStorageKey() {
        if(Check.isNullOrUndefined(this.tastyOrderRawData.replacesOrderId)) {
            return;
        }

        const replaceAttempts = this._getReplaceAttemptStorageData(this.tastyOrderRawData.replacesOrderId.toString());

        if(Check.isNullOrUndefined(replaceAttempts)) {
            return;
        }


        this.services.localStorage.removeItem(AppLocalStorageKeys.orderReplaceAttemptCount,
                                              this._getLocalStorageDiscriminator(this.tastyOrderRawData.replacesOrderId.toString()));

        this.services.localStorage.setJson(AppLocalStorageKeys.orderReplaceAttemptCount, replaceAttempts, this._getLocalStorageDiscriminator());
    }

}