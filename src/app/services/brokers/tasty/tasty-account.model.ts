import {ITastyAccountRawData} from "./raw-data/tasty-account.raw-data.interfaces";
import TastyTradeClient from "@tastytrade/api";
import {IAppServiceFactory} from "../../app-service-factory.interface";
import {IBrokerageAccountViewModel, IOpenOrdersResult} from "../interfaces/brokerage-account.view-model.interface";
import {IOpenOrderRequest} from "../interfaces/open-order-request.interface";
import {IAccountOpenOrderViewModel} from "../interfaces/account-open-order-interface";
import {TastyOpenOrdersReader} from "./tasty-open-orders-reader";
import {TastyOpenOrderModel} from "./tasty-open-order.model";
import {makeObservable, observable, runInAction} from "mobx";

export class TastyAccountModel implements IBrokerageAccountViewModel {
    constructor(private readonly accountRawData: ITastyAccountRawData,
                private readonly tastyClient: TastyTradeClient,
                private readonly services: IAppServiceFactory) {

        makeObservable<this, '_openOrders'>(this, {
            _openOrders: observable.ref
        })

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

    private _openOrders: IOpenOrdersResult | null = null;

    private _setOpenOrders(orders: IAccountOpenOrderViewModel[], isLoading: boolean = false): void {
        runInAction(() => {
            this._openOrders = {
                isLoading: isLoading,
                orders: orders
            }
        });

    }

    get openOrders(): IOpenOrdersResult {
        if(!this._openOrders) {
            this._setOpenOrders([], true)

            this._loadOpenOrders().then(orders => {
                this._setOpenOrders(orders);
            }).catch(err => {
                this.services.logger.error('Failed to load open orders from Tasty Trade', err);
                this.services.toaster.showErrorToast({
                    renderContent: () => this.services.language.translate('Failed to load open orders from Tasty Trade: {error}')
                });

                this._setOpenOrders([]);
            })

            return this._openOrders ?? {
                isLoading: false,
                orders: []
            };

        }
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

    private async _loadOpenOrders(): Promise<IAccountOpenOrderViewModel[]> {
        const openPositions = await new TastyOpenOrdersReader(this.accountNumber, this.tastyClient, this.services).read();

        console.log(openPositions.groupByKey(p => p.underlyingSymbol));

        return openPositions.map(order => new TastyOpenOrderModel(this.services, order));
    }

}