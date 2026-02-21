import {IBrokerageAccountViewModel, IBrokerOrder} from "./brokerage-account.service.interface";
import {IAppServiceFactory} from "../app-service-factory.interface";

export class BrokerageAccountModel implements IBrokerageAccountViewModel {
    constructor(public readonly accountNumber: string, private readonly services: IAppServiceFactory) {
    }

    async sendOrder(order: IBrokerOrder): Promise<void> {
        await this.services.marketDataProvider.sendOrder(this.accountNumber, {
            orderType: order.orderType,
            price: order.price,
            priceEffect: order.priceEffect,
            timeInForce: order.timeInForce,
            legs: order.legs.map(l => {
                return {
                    symbol: l.symbol,
                    action: l.action,
                    instrumentType: l.instrumentType,
                    quantity: l.quantity
                }
            })
        })
    }
}