import {IOpenOrderRequest} from "./open-order-request.interface";
import {IActiveOrderViewModel} from "./active-order.interfaces";
import {IWorkingOrderViewModel} from "./working-order.interfaces";


export interface IBrokerageAccountViewModel {
    readonly id: string;
    readonly brokerName: string;
    readonly accountNumber: string;
    readonly activeOrders: IActiveOrdersResult;
    readonly workingOrders: IWorkingOrderViewModel[];
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
    connect(): Promise<void>;
    disconnect(): Promise<void>;
}

export interface IActiveOrdersResult {
    readonly isLoading: boolean;
    readonly orders: IActiveOrderViewModel[];
}
