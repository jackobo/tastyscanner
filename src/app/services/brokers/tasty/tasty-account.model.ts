import {ITastyAccountRawData} from "./raw-data/tasty-account.raw-data.interfaces";
import TastyTradeClient from "@tastytrade/api";
import {IAppServiceFactory} from "../../app-service-factory.interface";
import {IBrokerageAccountViewModel} from "../interfaces/brokerage-account.view-model.interface";
import {IOpenOrderRequest} from "../interfaces/open-order-request.interface";
import {IAccountOpenOrderViewModel} from "../interfaces/account-open-order-interface";
import {TastyOpenOrdersReader} from "./tasty-open-orders-reader";
import {TastyOpenOrderModel} from "./tasty-open-order.model";

export class TastyAccountModel implements IBrokerageAccountViewModel {
    constructor(private readonly accountRawData: ITastyAccountRawData,
                private readonly tastyClient: TastyTradeClient,
                private readonly services: IAppServiceFactory) {

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

    async getOpenOrders(): Promise<IAccountOpenOrderViewModel[]> {
        const openPositions = await new TastyOpenOrdersReader(this.accountNumber, this.tastyClient, this.services).read();

        console.log(openPositions.groupByKey(p => p.underlyingSymbol));

        return openPositions.map(order => new TastyOpenOrderModel(this.services, order));
    }

}