import {makeObservable, observable, runInAction} from "mobx";
import {TastyWorkingOrderModel} from "./tasty-working-order.model";
import {Check} from "../../../../../../framework/utils/type-checking";
import {Lazy} from "../../../../../../framework/utils/lazy";
import {TimeSpan} from "../../../../../../framework/types/time-span";
import {NullableNumber, NullableUndefinedBoolean} from "../../../../../../framework/types/nullable-types";
import {NullablePrice} from "../../../../../models/price/price";
import {ITastyOrderRawData} from "../../raw-data/tasty-order.raw-data.interfaces";
import {IAppServiceFactory} from "../../../../app-service-factory.interface";
import {GobyOrderSource} from "../../../goby-order-source";
import {AppLocalStorageKeys} from "../../../../storage/app-local-storage-keys";
import {IWorkingOrderAutoReplaceHandlerViewModel} from "../../../interfaces/working-order.interfaces";

export const WORKING_ORDERS_MAX_AUTO_REPLACE_TIME_INTERVAL = TimeSpan.fromSeconds(5);
const WORKING_ORDER_AUTO_REPLACE_TIME_LIMIT = TimeSpan.fromSeconds(20);

export class TastyWorkingOrderAutoReplaceHandlerModel implements IWorkingOrderAutoReplaceHandlerViewModel {
    constructor(private readonly workingOrder: TastyWorkingOrderModel) {

        this._autoReplaceAttemptsStorageHandler = new Lazy<AutoReplaceAttemptsStorageHandler>(() =>
            new AutoReplaceAttemptsStorageHandler(workingOrder.tastyOrderRawData, this.workingOrder.services, this.gobySource));

        if(this.gobySource) {
            this._autoReplaceAttemptsStorageHandler.forceInit();
        }

        makeObservable<this, '_maxAutoReplaceAttempts' | '_isAutoReplaceSuspended'>(this, {
            _maxAutoReplaceAttempts: observable.ref,
            _isAutoReplaceSuspended: observable.ref
        })
    }

    private readonly _autoReplaceAttemptsStorageHandler: Lazy<AutoReplaceAttemptsStorageHandler>;

    get isLiveOrder(): boolean {
        //VITE_IGNORE_LIVE_STATUS_FOR_WORKING_ORDER is here to be able to test the logic in development while the market is closed.
        return this.workingOrder.tastyOrderRawData.status === "Live" || import.meta.env.VITE_IGNORE_LIVE_STATUS_FOR_WORKING_ORDER === 'true'
    }


    get services() {
        return this.workingOrder.services;
    }

    get gobySource() {
        return this.workingOrder.gobySource;
    }

    get autoReplaceEnabled(): boolean {
        return Boolean(this.gobySource?.autoReplaceEnabled) && this.isLiveOrder;
    }

    get autoReplacePaused(): boolean {
        return this._autoReplaceAttemptsStorageHandler.value.paused;
    }
    set autoReplacePaused(value) {
        this._autoReplaceAttemptsStorageHandler.value.paused = value;
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

    getAutoReplaceAttemptStorageDiscriminator(): string {
        return this._autoReplaceAttemptsStorageHandler.value.getStorageDiscriminator().discriminator;
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
        return this.gobySource?.autoReplaceAttempts ?? 0;
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

    public async autoReplace(): Promise<void> {

        await this.workingOrder.executeAction(this.services.language.translate('Failed to auto replace order!'), async () => {
            if(!this.autoReplaceEnabled) {
                return;
            }
            if(!this.gobySource) {
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
            await this.workingOrder.replaceOrder(newPrice, this.gobySource.withAutoReplaceAttempts(this.numberOfAutoReplaceAttempts + 1));

        });
    }

    private async _getMaxAttemptsAndTickSize(): Promise<{maxAttempts: number, tickSize: number}> {

        const tickSize = await this.workingOrder.getOptionsTickSize();

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

    private async _getPriceForAutoReplace(): Promise<NullablePrice> {

        const {maxAttempts, tickSize} = await this._getMaxAttemptsAndTickSize();

        if(this.numberOfAutoReplaceAttempts >= maxAttempts) {
            return null;
        }

        if(this.workingOrder.tradingPrice.isCredit) {
            return this.workingOrder.tradingPrice.subtractValue(tickSize); //make it a little bit cheaper to get filled
        } else if(this.workingOrder.tradingPrice.isDebit) {
            return this.workingOrder.tradingPrice.addValue(tickSize); //make it a little bit expensive to get filled
        } else {
            this.services.logger.error('Unexpected price effect', this.workingOrder.tastyOrderRawData.priceEffect);
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
