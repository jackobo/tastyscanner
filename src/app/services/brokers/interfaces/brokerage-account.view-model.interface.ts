import {IOpenOrderRequest} from "./open-order-request.interface";
import {IAccountOpenOrderViewModel} from "./account-open-order-interface";


export interface IBrokerageAccountViewModel {
    readonly id: string;
    readonly brokerName: string;
    readonly accountNumber: string;
    readonly openOrders: IOpenOrdersResult;
    readonly accountInfo: IBrokerageAccountInfoViewModel | null;
    sendOrder(order: IOpenOrderRequest): Promise<void>;
    countSoldLegs(symbol: string): number;
    countBoughtLegs(symbol: string): number;
}

export interface IBrokerageAccountInfoViewModel {
    cashBalance: number;
    netLiquidity: number;
    optionsBuyingPower: number;
    stocksBuyingPower: number;
}

export interface IBrokerageAccountModel extends IBrokerageAccountViewModel {
    init(): Promise<void>;
    dispose(): Promise<void>;
}

export interface IOpenOrdersResult {
    readonly isLoading: boolean;
    readonly orders: IAccountOpenOrderViewModel[];
}
