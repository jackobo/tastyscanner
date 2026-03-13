export interface IWorkingOrderViewModel {
    readonly id: string;
    readonly underlyingSymbol: string;
    readonly tradingPrice: number;
    readonly hasGuvidulSource: boolean
    cancelOrder(): Promise<void>;
}
