import {ITastyAccountRawData} from "./raw-data/tasty-account.raw-data.interfaces";
import TastyTradeClient from "@tastytrade/api";
import {IAppServiceFactory} from "../../app-service-factory.interface";
import {
    IBrokerageAccountModel,
    IOpenOrdersResult
} from "../interfaces/brokerage-account.view-model.interface";
import {IOpenOrderRequest} from "../interfaces/open-order-request.interface";
import {TastyOpenOrdersReader} from "./tasty-open-orders-reader";
import {TastyOpenOrderLegModel, TastyOpenOrderModel} from "./tasty-open-order.model";
import {computed, makeObservable, observable, runInAction} from "mobx";
import {TastyAccountInfoModel} from "./tasty-account-info.model";


class TastyOpenOrdersResult implements IOpenOrdersResult {
    constructor(public readonly isLoading: boolean, public readonly orders: TastyOpenOrderModel[]) {
    }

}

export class TastyAccountModel implements IBrokerageAccountModel {
    constructor(private readonly accountRawData: ITastyAccountRawData,
                private readonly tastyClient: TastyTradeClient,
                private readonly services: IAppServiceFactory) {

        makeObservable<this, '_openOrders' | 'openOrdersLegsMap' | '_accountInfo'>(this, {
            _openOrders: observable.ref,
            _accountInfo: observable.ref,
            openOrdersLegsMap: computed,
        });
    }

    get id(): string {
        return `${this.brokerName}-${this.accountNumber}`
    }

    get brokerName(): string {
        return "Tasty";
    }

    get accountNumber(): string {
        return this.accountRawData.accountNumber;
    }

    private _accountInfo: TastyAccountInfoModel | null = null;
    get accountInfo(): TastyAccountInfoModel | null{
        return this._accountInfo;
    }


    async init(): Promise<void> {
        await this._loadOpenOrders();
        await this._loadAccountInfo();
    }

    async dispose(): Promise<void> {
        const streamerSymbols = this.openOrders.orders.selectMany(o => o.getAllStreamerSymbols());
        this.services.marketDataProvider.unsubscribeForOpenPositions(streamerSymbols);
    }


    private _openOrders: TastyOpenOrdersResult = new TastyOpenOrdersResult(true, []);

    private get openOrdersLegsMap(): Record<string, TastyOpenOrderLegModel> {
        return this._openOrders.orders.selectMany(o => o.legs)
                                      .toDictionaryOfType(leg => leg.symbol, leg => leg);
    }

    private _setOpenOrders(orders: TastyOpenOrderModel[]): void {
        runInAction(() => {
            this._openOrders = new TastyOpenOrdersResult(false, orders);
        });
    }

    get openOrders(): TastyOpenOrdersResult {
        return this._openOrders;
    }


    async sendOrder(order: IOpenOrderRequest): Promise<void> {
        try {
            const orderData = {
                "order-type": order.orderType,
                "time-in-force": order.timeInForce,
                "price": order.price,
                "price-effect": order.priceEffect,
                "legs": order.legs.map(leg => {
                    return {
                        "action": leg.action,
                        "instrument-type": leg.instrumentType,
                        "quantity": leg.quantity,
                        "symbol": leg.symbol
                    }
                })
            }
            await this.tastyClient.orderService.createOrder(this.accountNumber, orderData);
        }
        catch (e) {
            await this.services.toaster.showErrorToast({
                renderContent: () => this.services.language.translate('Failed to place Tasty order')
            });
        }

    }

    countSoldLegs(symbol: string): number {
        const leg = this.openOrdersLegsMap[symbol];
        if(!leg?.isSell) {
            return 0;
        }

        return Math.abs(leg.quantity);
    }

    countBoughtLegs(symbol: string): number {
        const leg = this.openOrdersLegsMap[symbol];
        if(!leg?.isBuy) {
            return 0;
        }

        return Math.abs(leg.quantity);
    }



    private async _loadOpenOrders(): Promise<void> {

        try {
            const rawOpenOrders = await new TastyOpenOrdersReader(this.accountNumber, this.tastyClient, this.services).read();
            const openOrdersModels = rawOpenOrders.map(order => new TastyOpenOrderModel(this.services, order));

            const streamerSymbols = openOrdersModels.selectMany(order => order.getAllStreamerSymbols());
            this.services.marketDataProvider.subscribeForOpenPositions(streamerSymbols);

            this._setOpenOrders(openOrdersModels);
        } catch (err) {
            this.services.logger.error('Failed to load open orders from Tasty Trade', err);
            await this.services.toaster.showErrorToast({
                renderContent: () => this.services.language.translate('Failed to load open orders from Tasty Trade: {error}')
            });
            this._setOpenOrders([]);
        }
    }

    private async _loadAccountInfo(): Promise<void> {
        const rawAccountInfo = await this.tastyClient.balancesAndPositionsService.getAccountBalanceValues(this.accountNumber);
        runInAction(() => {
            this._accountInfo = new TastyAccountInfoModel(rawAccountInfo);
        });
    }

    /*
    {
    "account-number": "5WZ51885",
    "available-trading-funds": "0.0",
    "bond-margin-requirement": "0.0",
    "cash-available-to-withdraw": "22216.6",
    "cash-balance": "44178.164",
    "cash-settle-balance": "22216.6",
    "closed-loop-available-balance": "22216.6",
    "cryptocurrency-margin-requirement": "0.0",
    "currency": "USD",
    "day-equity-call-value": "0.0",
    "day-trade-excess": "22216.6",
    "day-trading-buying-power": "0.0",
    "day-trading-call-value": "0.0",
    "derivative-buying-power": "13278.164",
    "equity-buying-power": "26556.328",
    "equity-offering-margin-requirement": "0.0",
    "fixed-income-security-margin-requirement": "0.0",
    "futures-margin-requirement": "0.0",
    "intraday-equities-cash-amount": "3638.614",
    "intraday-equities-cash-effect": "Debit",
    "intraday-equities-cash-effective-date": "2026-03-05",
    "intraday-futures-cash-amount": "475.98",
    "intraday-futures-cash-effect": "Debit",
    "intraday-futures-cash-effective-date": "2026-01-21",
    "long-bond-value": "0.0",
    "long-cryptocurrency-value": "0.0",
    "long-derivative-value": "58670.0",
    "long-equity-value": "0.0",
    "long-fixed-income-security-value": "0.0",
    "long-futures-derivative-value": "0.0",
    "long-futures-value": "0.0",
    "long-margineable-value": "0.0",
    "maintenance-call-value": "0.0",
    "maintenance-requirement": "30900.0",
    "margin-equity": "44178.164",
    "margin-settle-balance": "48098.6",
    "net-liquidating-value": "41409.164",
    "pending-cash": "0.0",
    "pending-cash-effect": "None",
    "previous-day-cryptocurrency-fiat-amount": "0.0",
    "previous-day-cryptocurrency-fiat-effect": "None",
    "reg-t-call-value": "0.0",
    "short-cryptocurrency-value": "0.0",
    "short-derivative-value": "61439.0",
    "short-equity-value": "0.0",
    "short-futures-derivative-value": "0.0",
    "short-futures-value": "0.0",
    "short-margineable-value": "0.0",
    "sma-equity-option-buying-power": "15683.014",
    "special-memorandum-account-apex-adjustment": "2404.85",
    "special-memorandum-account-value": "13278.16",
    "total-settle-balance": "48098.6",
    "unsettled-cryptocurrency-fiat-amount": "0.0",
    "unsettled-cryptocurrency-fiat-effect": "None",
    "used-derivative-buying-power": "28231.0",
    "snapshot-date": "2026-03-05",
    "reg-t-margin-requirement": "30900.0",
    "futures-overnight-margin-requirement": "0.0",
    "futures-intraday-margin-requirement": "0.0",
    "maintenance-excess": "13278.164",
    "pending-margin-interest": "0.0",
    "buying-power-adjustment": "0.0",
    "buying-power-adjustment-effect": "None",
    "effective-cryptocurrency-buying-power": "13278.164",
    "total-pending-liquidity-pool-rebate": "0.0",
    "long-index-derivative-value": "34735.0",
    "short-index-derivative-value": "36230.0",
    "updated-at": "2026-03-05T21:38:23.529+00:00"
}
    */

}