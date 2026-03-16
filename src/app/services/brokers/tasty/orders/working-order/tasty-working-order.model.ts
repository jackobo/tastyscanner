import {IReplaceWorkingOrderOptions, IWorkingOrderViewModel} from "../../../interfaces/working-order.interfaces";
import {ITastyOrderRawData} from "../../raw-data/tasty-order.raw-data.interfaces";
import TastyTradeClient from "@tastytrade/api";
import {IAppServiceFactory} from "../../../../app-service-factory.interface";
import {AppLocalStorageKeys} from "../../../../storage/app-local-storage-keys";
import {Check} from "../../../../../../framework/utils/type-checking";
import {TimeSpan} from "../../../../../../framework/types/time-span";
import {NullableNumber, NullableUndefinedBoolean} from "../../../../../../framework/types/nullable-types";
import {GobyOrderSource} from "../../../goby-order-source";
import {Lazy} from "../../../../../../framework/utils/lazy";
import {TastyWorkingOrderLegModel} from "./tasty-working-order-leg.model";
import {MathUtils} from "../../../../../../framework/utils/math-utils";
import {makeObservable, observable, runInAction} from "mobx";
import {PriceEffect, PriceEffectShort} from "../../../interfaces/open-order-request.interface";

export const WORKING_ORDERS_MAX_AUTO_REPLACE_TIME_INTERVAL = TimeSpan.fromSeconds(5);
const WORKING_ORDER_AUTO_REPLACE_TIME_LIMIT = TimeSpan.fromSeconds(20);


export class TastyWorkingOrderModel implements IWorkingOrderViewModel {
    constructor(private readonly tastyOrderRawData: ITastyOrderRawData,
                private readonly tastyClient: TastyTradeClient,
                private readonly services: IAppServiceFactory) {
        this._gobySource = GobyOrderSource.tryParse(tastyOrderRawData.source);
        this._autoReplaceAttemptsStorageHandler = new Lazy<AutoReplaceAttemptsStorageHandler>(() =>
            new AutoReplaceAttemptsStorageHandler(tastyOrderRawData, services, this._gobySource));

        if(this._gobySource) {
            this._autoReplaceAttemptsStorageHandler.forceInit();
        }
        this.legs = tastyOrderRawData.legs.map(leg => new TastyWorkingOrderLegModel(leg, tastyOrderRawData.underlyingSymbol, services));

        makeObservable<this, '_maxAutoReplaceAttempts' | '_optionsTickSize' | '_isActionInProgress' | '_isAutoReplaceSuspended'>(this, {
            _maxAutoReplaceAttempts: observable.ref,
            _optionsTickSize: observable.ref,
            _isActionInProgress: observable.ref,
            _isAutoReplaceSuspended: observable.ref
        })
    }

    private readonly _autoReplaceAttemptsStorageHandler: Lazy<AutoReplaceAttemptsStorageHandler>;
    private _gobySource: GobyOrderSource | null = null;
    readonly legs: TastyWorkingOrderLegModel[] = [];

    private _isActionInProgress: boolean = false;

    get isActionInProgress(): boolean {
        return this._isActionInProgress;
    }

    set isActionInProgress(value: boolean) {
        runInAction(() => {
            this._isActionInProgress = value;
        })
    }

    dispose(): void {
        this.legs.forEach(leg => {
            leg.dispose();
        });
    }

    private get accountNumber(): string {
        return this.tastyOrderRawData.accountNumber;
    }

    get autoReplaceEnabled(): boolean {
        return Boolean(this._gobySource?.autoReplaceEnabled) && this.isLiveOrder;
    }

    get autoReplacePaused(): boolean {
        return this._autoReplaceAttemptsStorageHandler.value.paused;
    }
    set autoReplacePaused(value) {
        this._autoReplaceAttemptsStorageHandler.value.paused = value;
    }

    get receivedAt(): Date {
        return this.tastyOrderRawData.receivedAt;
    }

    private _isAutoReplaceSuspended: boolean = false;
    suspendAutoReplace(): void {
        runInAction(() => {
            this._isAutoReplaceSuspended = true;
        })

    }
    resumeAutoReplace(): void {
        runInAction(() => {
            this._isAutoReplaceSuspended = false;
        })
    }



    get id(): string {
        return this.tastyOrderRawData.id.toString();
    }

    private get orderIdAsNumber() {
        return this.tastyOrderRawData.id;
    }

    getAutoReplaceAttemptStorageDiscriminator(): string {
        return this._autoReplaceAttemptsStorageHandler.value.getStorageDiscriminator().discriminator;
    }

    get underlyingSymbol(): string {
        return this.tastyOrderRawData.underlyingSymbol;
    }

    get tradingPrice(): number {
        return parseFloat(this.tastyOrderRawData.price);
    }

    get priceEffect(): PriceEffect {
        return this.tastyOrderRawData.priceEffect;
    }

    get priceEffectShort(): PriceEffectShort {
        if(this.tastyOrderRawData.priceEffect === "Credit") {
            return "cr";
        } else {
            return "db";
        }
    }

    get midPrice(): NullableNumber {
        const legsWithMidPrices = this.legs.filter(leg => !Check.isNullOrUndefined(leg.midPrice));
        if(legsWithMidPrices.length !== this.legs.length) {
            return null;
        }

        return Math.abs(MathUtils.round(legsWithMidPrices.sum(leg => leg.midPrice ?? 0), 2));

    }

    get isGobyOrder(): boolean {
        return Boolean(this._gobySource);
    }




    private _optionsTickSize: NullableNumber = null;
    get optionsTickSize(): NullableNumber {
        if(Check.isNullOrUndefined(this._optionsTickSize)) {
            this._getMaxAttemptsAndTickSize().then(result => {
                runInAction(() => {
                    this._optionsTickSize = result.tickSize;
                })
            });
        }

        return this._optionsTickSize;
    }
    get timeUntilNextAutoReplace(): TimeSpan | null {
        if(this.autoReplacePaused || this._isAutoReplaceSuspended) {
            return null;
        }

        if(!this.maxAutoReplaceAttempts) {
            return null;
        }

        if(this.numberOfAutoReplaceAttempts >= this.maxAutoReplaceAttempts) {
         return null;
        }

        const lastAttemptTime = this._autoReplaceAttemptsStorageHandler.value.lastAttemptTime;
        const nextAttemptTime = lastAttemptTime + WORKING_ORDER_AUTO_REPLACE_TIME_LIMIT.totalMilliseconds - this.services.time.currentDate.getTime();
        if(nextAttemptTime < 0) {
            return TimeSpan.Zero;
        }
        return TimeSpan.fromMilliseconds(nextAttemptTime);


    }


    get numberOfAutoReplaceAttempts(): number {
        return this._gobySource?.autoReplaceAttempts ?? 0;
    }
    private _maxAutoReplaceAttempts: NullableNumber = null;
    get maxAutoReplaceAttempts(): NullableNumber {
        if(Check.isNullOrUndefined(this._maxAutoReplaceAttempts)) {
            this._getMaxAttemptsAndTickSize().then(result => {
                runInAction(() => {
                    this._maxAutoReplaceAttempts = result.maxAttempts;
                })
            });
        }

        return this._maxAutoReplaceAttempts;
    }

    private async _executeAction(failMessage: string, action: () => Promise<void>): Promise<void> {
        if(this.isActionInProgress) {
            return;
        }

        this.isActionInProgress = true;
        try {
            await action();
        } catch(err) {
            this.services.logger.error('Failed to execute action', err);
            await this.services.toaster.showErrorToast({
                renderContent: () => `${failMessage}} Error: ${err}`
            });
        } finally {
            this.isActionInProgress = false;
        }
    }


    public  async cancel(): Promise<void> {

        await this._executeAction( this.services.language.translate('Failed to cancel order!'), async () => {
            await this.tastyClient.orderService.cancelOrder(this.accountNumber, this.orderIdAsNumber);
        })

    }

    public async replace(newPrice: number, options?: IReplaceWorkingOrderOptions): Promise<void> {

        await this._executeAction(this.services.language.translate('Failed to replace order!'), async () => {
            let gobySource = this._gobySource;
            if(gobySource && options?.resetAutoReplaceAttempts) {
                gobySource = gobySource.withAutoReplaceAttempts(0);
            }
            this._gobySource = await this._replaceOrder(newPrice, gobySource);
        })

    }

    private get isLiveOrder(): boolean {
        //VITE_IGNORE_LIVE_STATUS_FOR_WORKING_ORDER is here to be able to test the logic in development while the market is closed.
        return this.tastyOrderRawData.status === "Live" || import.meta.env.VITE_IGNORE_LIVE_STATUS_FOR_WORKING_ORDER === 'true'
    }

    public async autoReplace(): Promise<void> {

        await this._executeAction(this.services.language.translate('Failed to auto replace order!'), async () => {
            if(!this.autoReplaceEnabled) {
                return;
            }
            if(!this._gobySource) {
                return;
            }

            if(this.autoReplacePaused) {
                return;
            }

            if(this._isAutoReplaceSuspended) {
                return;
            }


            if((this.services.time.currentDate.getTime() - this._autoReplaceAttemptsStorageHandler.value.lastAttemptTime) < WORKING_ORDER_AUTO_REPLACE_TIME_LIMIT.totalMilliseconds) {
                return;
            }

            const newPrice = await this._getPriceForAutoReplace();

            if(Check.isNullOrUndefined(newPrice)) {
                return;
            }

            this._autoReplaceAttemptsStorageHandler.value.setLastAttemptTime();
            this._gobySource = await this._replaceOrder(newPrice, this._gobySource.withAutoReplaceAttempts(this.numberOfAutoReplaceAttempts + 1));

        });


    }

    private async _replaceOrder(newPrice: number, gobySource: GobyOrderSource | null): Promise<GobyOrderSource | null> {
        if(gobySource) {
            gobySource = gobySource.withAutoReplacePaused(this.autoReplacePaused);
        }
        await this.tastyClient.orderService.replaceOrder(this.accountNumber, this.orderIdAsNumber, {
            "order-type": this.tastyOrderRawData.orderType,
            "time-in-force": this.tastyOrderRawData.timeInForce,
            "price": newPrice,
            "price-effect": this.tastyOrderRawData.priceEffect,
            "source": Check.isNullOrUndefined(gobySource) ? this.tastyOrderRawData.source : gobySource.toString(),
            "legs": this.tastyOrderRawData.legs.map(leg => {
                return {
                    "action": leg.action,
                    "instrument-type": leg.instrumentType,
                    "quantity": leg.quantity,
                    "symbol": leg.symbol
                }
            })
        });

        return gobySource;
    }


    private async _getMaxAttemptsAndTickSize(): Promise<{maxAttempts: number, tickSize: number}> {
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

        return {maxAttempts, tickSize};
    }

    private async _getPriceForAutoReplace(): Promise<NullableNumber> {

        const {maxAttempts, tickSize} = await this._getMaxAttemptsAndTickSize();

        if(this.numberOfAutoReplaceAttempts >= maxAttempts) {
            return null;
        }

        if(this.priceEffect === "Credit") {
            return this.tradingPrice - tickSize; //make it a little bit cheaper to get filled
        } else if(this.priceEffect === "Debit") {
            return  this.tradingPrice + tickSize; //make it a little bit expensive to get filled
        } else {
            this.services.logger.error('Unexpected price effect', this.priceEffect);
            return null;
        }
    }


}

interface IAutoReplaceAttemptStorageData {
    lastAttemptTime: number;
    paused: boolean;
}

class AutoReplaceAttemptsStorageHandler {
    constructor(private readonly tastyOrderRawData: ITastyOrderRawData,
                private readonly services: IAppServiceFactory,
                gobySource: GobyOrderSource | null) {
        this.setLastAttemptTime();

        if(gobySource) {
            this.paused = gobySource.autoReplacePaused || this.paused;
        }

        makeObservable<this, '_paused'>(this, {
            _paused: observable.ref
        })
    }


    private _paused: NullableUndefinedBoolean = null;
    get paused(): boolean {
        const isPausedFromStorage = this._getStorageData().paused;

        if(isPausedFromStorage !== this._paused) {
            runInAction(() => {
                this._paused = isPausedFromStorage;
            })
        }

        if(Check.isNullOrUndefined(this._paused)) {
            return isPausedFromStorage;
        }

        return this._paused;

    }

    set paused(value: boolean) {
        this._setStorageData({
            paused: value,
            lastAttemptTime: this.services.time.currentDate.getTime()
        });
        runInAction(() => {
            this._paused = value;
        })
    }

    get lastAttemptTime(): number {
        const replaceAttempts = this._getStorageData();
        if(Check.isNullOrUndefined(replaceAttempts)) {
            return this.services.time.currentDate.getTime();
        }

        return replaceAttempts.lastAttemptTime;
    }

    setLastAttemptTime(): void {
        this._setStorageData({
            lastAttemptTime: this.services.time.currentDate.getTime()
        });

    }

    getStorageDiscriminator(): {discriminator: string} {
        return {
            discriminator: `Tasty.${this.tastyOrderRawData.accountNumber}.${this.tastyOrderRawData.id.toString()}`
        }
    }

    private _getStorageData(): IAutoReplaceAttemptStorageData {
        return this.services.localStorage.getJson<IAutoReplaceAttemptStorageData>(AppLocalStorageKeys.orderAutoReplace,
                                                  this.getStorageDiscriminator())
            ?? {
                paused: false,
                lastAttemptTime: this.services.time.currentDate.getTime(),
            };
    }

    private _setStorageData(data: Partial<IAutoReplaceAttemptStorageData>): void {
        this.services.localStorage.setJson(AppLocalStorageKeys.orderAutoReplace, {
            ...this._getStorageData(),
            ...data
        }, this.getStorageDiscriminator());
    }

}

