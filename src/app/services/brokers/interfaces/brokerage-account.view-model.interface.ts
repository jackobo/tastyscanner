import {IOpenOrderRequest} from "./open-order-request.interface";
import {IAccountOpenPositionViewModel} from "./account-open-position-interface";


export interface IBrokerageAccountViewModel {
    readonly id: string;
    readonly brokerName: string;
    readonly accountNumber: string;
    getOpenPositions(): Promise<any[]>;
    sendOrder(order: IOpenOrderRequest): Promise<void>;

}
