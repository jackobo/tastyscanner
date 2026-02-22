import {ITastyAccountOrderRawData} from "../tasty/raw-data/tasty-order.raw-data.interfaces";
import {IBrokerOpenOrderRequest} from "./broker-open-order-request.interface";


export interface IBrokerageAccountViewModel {
    readonly id: string;
    readonly brokerName: string;
    readonly accountNumber: string;
    getOpenPositions(): Promise<ITastyAccountOrderRawData[]>;
    balanceAndPositions(): Promise<any[]>;
    sendOrder(order: IBrokerOpenOrderRequest): Promise<void>;

}
