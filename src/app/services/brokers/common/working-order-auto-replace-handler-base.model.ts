import {IWorkingOrderAutoReplaceHandlerViewModel} from "../interfaces/working-order.interfaces";
import {GobyOrderSource} from "../goby-order-source";
import {IAppServiceFactory} from "../../app-service-factory.interface";
import {Lazy} from "../../../../framework/utils/lazy";
import {makeObservable, observable, runInAction} from "mobx";
import {AppLocalStorageKeys} from "../../storage/app-local-storage-keys";
import {Check} from "../../../../framework/utils/type-checking";
import {NullableNumber, NullableUndefinedBoolean} from "../../../../framework/types/nullable-types";
import {TimeSpan} from "../../../../framework/types/time-span";
import {NullablePrice, Price} from "../../../models/price/price";

const WORKING_ORDER_AUTO_REPLACE_TIME_LIMIT = TimeSpan.fromSeconds(20);

export abstract class WorkingOrderAutoReplaceHandlerBaseModel implements IWorkingOrderAutoReplaceHandlerViewModel {
    protected constructor(protected readonly services: IAppServiceFactory,
                          protected readonly gobySource: GobyOrderSource | null,
                          brokerName: string,
                          accountNumber: string,
                          orderId: string,) {
        this._autoReplaceAttemptsStorageHandler = new Lazy<AutoReplaceAttemptsStorageHandler>(() =>
            new AutoReplaceAttemptsStorageHandler(brokerName, accountNumber, orderId, this.services, this.gobySource));

        if(this.gobySource) {
            this._autoReplaceAttemptsStorageHandler.forceInit();
        }

        makeObservable<this, '_maxAutoReplaceAttempts' | '_isAutoReplaceSuspended'>(this, {
            _maxAutoReplaceAttempts: observable.ref,
            _isAutoReplaceSuspended: observable.ref
        })
    }

    private readonly _autoReplaceAttemptsStorageHandler: Lazy<AutoReplaceAttemptsStorageHandler>;

    abstract get underlyingSymbol(): string;
    abstract get tradingPrice(): Price;
    abstract get isLiveOrder(): boolean;
    protected abstract _executeAutoReplace(price: Price, gobySource: GobyOrderSource): Promise<void>;

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

    public async autoReplace(): Promise<void> {
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
        await this._executeAutoReplace(newPrice, this.gobySource.withAutoReplaceAttempts(this.numberOfAutoReplaceAttempts + 1));
    }

    private async _getOptionsTickSize(): Promise<number> {
        const tickerInfo = await this.services.tickers.getTicker(this.underlyingSymbol).getInfoAsync();

        return tickerInfo.getOptionTickSize(this.tradingPrice.value);
    }

    private async _getMaxAttemptsAndTickSize(): Promise<{maxAttempts: number, tickSize: number}> {

        const tickSize = await this._getOptionsTickSize();

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

        if(this.tradingPrice.isCredit) {
            return this.tradingPrice.subtractValue(tickSize); //make it a little bit cheaper to get filled
        } else if(this.tradingPrice.isDebit) {
            return this.tradingPrice.addValue(tickSize); //make it a little bit expensive to get filled
        } else {
            this.services.logger.error('Unexpected price effect', this.tradingPrice.priceEffect);
            return null;
        }
    }

}

interface IAutoReplaceAttemptStorageData {
    lastAttemptTime: number;
    paused: boolean;
}


class AutoReplaceAttemptsStorageHandler {
    constructor(private readonly brokerName: string,
                private readonly accountNumber: string,
                private readonly orderId: string,
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
            discriminator: `${this.brokerName}.${this.accountNumber}.${this.orderId}`
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