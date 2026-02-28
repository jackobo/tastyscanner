import {IOpenOrderRequest} from "./open-order-request.interface";
import {IAccountOpenOrderViewModel} from "./account-open-order-interface";


export interface IBrokerageAccountViewModel {
    readonly id: string;
    readonly brokerName: string;
    readonly accountNumber: string;
    getOpenOrders(): Promise<IAccountOpenOrderViewModel[]>;
    sendOrder(order: IOpenOrderRequest): Promise<void>;

}
