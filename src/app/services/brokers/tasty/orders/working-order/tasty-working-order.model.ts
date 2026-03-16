import {IReplaceWorkingOrderOptions, IWorkingOrderViewModel} from "../../../interfaces/working-order.interfaces";
import {ITastyOrderRawData} from "../../raw-data/tasty-order.raw-data.interfaces";
import TastyTradeClient from "@tastytrade/api";
import {IAppServiceFactory} from "../../../../app-service-factory.interface";
import {Check} from "../../../../../../framework/utils/type-checking";
import {NullableNumber} from "../../../../../../framework/types/nullable-types";
import {GobyOrderSource} from "../../../goby-order-source";
import {Lazy} from "../../../../../../framework/utils/lazy";
import {TastyWorkingOrderLegModel} from "./tasty-working-order-leg.model";
import {MathUtils} from "../../../../../../framework/utils/math-utils";
import {makeObservable, observable, runInAction} from "mobx";
import {NullablePrice, Price} from "../../../../../models/price/price";
import {TastyWorkingOrderAutoReplaceHandlerModel} from "./tasty-working-order-auto-replace-handler.model";


export class TastyWorkingOrderModel implements IWorkingOrderViewModel {
    constructor(public readonly tastyOrderRawData: ITastyOrderRawData,
                private readonly tastyClient: TastyTradeClient,
                public readonly services: IAppServiceFactory) {
        this._gobySource = GobyOrderSource.tryParse(tastyOrderRawData.source);

        this.legs = tastyOrderRawData.legs.map(leg => new TastyWorkingOrderLegModel(leg, tastyOrderRawData.underlyingSymbol, services));

        this._autoReplaceHandler = new Lazy<TastyWorkingOrderAutoReplaceHandlerModel>(() => {
            return new TastyWorkingOrderAutoReplaceHandlerModel(this);
        });

        makeObservable<this, '_optionsTickSize' | '_isActionInProgress'>(this, {
            _optionsTickSize: observable.ref,
            _isActionInProgress: observable.ref
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


    get receivedAt(): Date {
        return this.tastyOrderRawData.receivedAt;
    }

    get id(): string {
        return this.tastyOrderRawData.id.toString();
    }

    private get orderIdAsNumber() {
        return this.tastyOrderRawData.id;
    }


    get underlyingSymbol(): string {
        return this.tastyOrderRawData.underlyingSymbol;
    }

    get tradingPrice(): Price {
        return new Price(this.tastyOrderRawData.price, this.tastyOrderRawData.priceEffect);
    }


    get midPrice(): NullablePrice {
        const legsWithMidPrices = this.legs.filter(leg => !Check.isNullOrUndefined(leg.midPrice));
        if(legsWithMidPrices.length !== this.legs.length) {
            return null;
        }

        return Price.fromValue(Math.abs(MathUtils.round(legsWithMidPrices.sum(leg => leg.midPrice ?? 0), 2)));

    }

    readonly legs: TastyWorkingOrderLegModel[] = [];


    private readonly _autoReplaceHandler: Lazy<TastyWorkingOrderAutoReplaceHandlerModel>;

    get autoReplaceHandler(): TastyWorkingOrderAutoReplaceHandlerModel {
        return this._autoReplaceHandler.value;
    }

    private _isActionInProgress: boolean = false;

    get isActionInProgress(): boolean {
        return this._isActionInProgress;
    }

    set isActionInProgress(value: boolean) {
        runInAction(() => {
            this._isActionInProgress = value;
        })
    }

    get isGobyOrder(): boolean {
        return Boolean(this._gobySource);
    }

    private _gobySource: GobyOrderSource | null = null;
    get gobySource(): GobyOrderSource | null {
        return this._gobySource;
    }

    private _optionsTickSize: NullableNumber = null;
    get optionsTickSize(): NullableNumber {
        if(Check.isNullOrUndefined(this._optionsTickSize)) {
            this.getOptionsTickSize().then(tickSize => {
                runInAction(() => {
                    this._optionsTickSize = tickSize;
                })
            });
        }

        return this._optionsTickSize;
    }


    public async getOptionsTickSize(): Promise<number> {
        const tickerInfo = await this.services.tickers.getTicker(this.underlyingSymbol).getInfoAsync();

        return tickerInfo.getOptionTickSize(this.tradingPrice.value);
    }

    async executeAction(failMessage: string, action: () => Promise<void>): Promise<void> {
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

        await this.executeAction( this.services.language.translate('Failed to cancel order!'), async () => {
            await this.tastyClient.orderService.cancelOrder(this.accountNumber, this.orderIdAsNumber);
        })

    }

    public async replace(newPrice: Price, options?: IReplaceWorkingOrderOptions): Promise<void> {

        await this.executeAction(this.services.language.translate('Failed to replace order!'), async () => {
            let gobySource = this._gobySource;
            if(gobySource && options?.resetAutoReplaceAttempts) {
                gobySource = gobySource.withAutoReplaceAttempts(0);
            }
            await this.replaceOrder(newPrice, gobySource);
        })

    }


    async replaceOrder(newPrice: Price, gobySource: GobyOrderSource | null): Promise<void> {
        if(gobySource) {
            gobySource = gobySource.withAutoReplacePaused(this.autoReplaceHandler.autoReplacePaused);
        }
        await this.tastyClient.orderService.replaceOrder(this.accountNumber, this.orderIdAsNumber, {
            "order-type": this.tastyOrderRawData.orderType,
            "time-in-force": this.tastyOrderRawData.timeInForce,
            "price": newPrice.value,
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

        this._gobySource = gobySource;
    }

}

