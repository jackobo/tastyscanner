import {IBrokerAccountViewModel, IBrokerOrder} from "./broker-account.service.interface";
import {IServiceFactory} from "../service-factory.interface";

export class BrokerAccountModel implements IBrokerAccountViewModel {
    constructor(public readonly accountNumber: string, private readonly services: IServiceFactory) {
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