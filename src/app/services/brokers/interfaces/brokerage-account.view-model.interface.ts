import {IOpenOrderRequest} from "./open-order-request.interface";
import {IActivePositionViewModel} from "./active-position.interfaces";
import {IWorkingOrderModel, IWorkingOrderViewModel} from "./working-order.interfaces";


export interface IBrokerageAccountViewModel {
    readonly id: string;
    readonly brokerName: string;
    readonly accountNumber: string;
    readonly activePositions: IActivePositionsResult;
    getActivePositionForSymbolAndExpiration(symbol: string, daysToExpiration: number): IActivePositionViewModel[];
    readonly workingOrders: IWorkingOrderViewModel[];
    readonly accountInfo: IBrokerageAccountInfoViewModel | null;
    sendOrder(order: IOpenOrderRequest): Promise<void>;
    countSellLegs(symbol: string): number;
    countBuysLegs(symbol: string): number;
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
    workingOrders: IWorkingOrderModel[];
}

export interface IActivePositionsResult {
    readonly isLoading: boolean;
    readonly positions: IActivePositionViewModel[];
}
