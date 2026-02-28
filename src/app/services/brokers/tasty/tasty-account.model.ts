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


class TastyOpenOrdersResult implements IOpenOrdersResult {
    constructor(public readonly isLoading: boolean, public readonly orders: TastyOpenOrderModel[]) {
    }

}

export class TastyAccountModel implements IBrokerageAccountModel {
    constructor(private readonly accountRawData: ITastyAccountRawData,
                private readonly tastyClient: TastyTradeClient,
                private readonly services: IAppServiceFactory) {

        makeObservable<this, '_openOrders' | 'openOrdersLegsMap'>(this, {
            _openOrders: observable.ref,
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


    async init(): Promise<void> {
        try {
            const openOrders = await this._loadOpenOrders();
            const streamerSymbols = openOrders.selectMany(order => order.getAllStreamerSymbols());
            this.services.marketDataProvider.subscribeForOpenPositions(streamerSymbols);
            this._setOpenOrders(openOrders);
        } catch (err) {
            this.services.logger.error('Failed to load open orders from Tasty Trade', err);
            await this.services.toaster.showErrorToast({
                renderContent: () => this.services.language.translate('Failed to load open orders from Tasty Trade: {error}')
            });
            this._setOpenOrders([]);
        }

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



    private async _loadOpenOrders(): Promise<TastyOpenOrderModel[]> {
        const rawOpenOrders = await new TastyOpenOrdersReader(this.accountNumber, this.tastyClient, this.services).read();

        //console.log(openPositions.groupByKey(p => p.underlyingSymbol));

        return rawOpenOrders.map(order => new TastyOpenOrderModel(this.services, order));
    }

}