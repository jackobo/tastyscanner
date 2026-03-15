export interface IWorkingOrderViewModel {
    readonly id: string;
    readonly underlyingSymbol: string;
    readonly tradingPrice: number;
    readonly isGobyOrder: boolean
    cancel(): Promise<void>;
}

export interface IWorkingOrderLegViewModel {
    readonly key: string;
    readonly isSell: boolean;
    readonly isBuy: boolean;
    readonly quantity: number;
}