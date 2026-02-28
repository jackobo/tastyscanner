import {IOpenOrderRequest} from "./open-order-request.interface";
import {IAccountOpenOrderViewModel} from "./account-open-order-interface";


export interface IBrokerageAccountViewModel {
    readonly id: string;
    readonly brokerName: string;
    readonly accountNumber: string;
    readonly openOrders: IOpenOrdersResult;
    sendOrder(order: IOpenOrderRequest): Promise<void>;
}

export interface IOpenOrdersResult {
    readonly isLoading: boolean;
    readonly orders: IAccountOpenOrderViewModel[];
}
