export interface IWorkingOrderViewModel {
    readonly id: string;
    readonly underlyingSymbol: string;
    readonly tradingPrice: number;
    readonly hasGoby: boolean
    cancelOrder(): Promise<void>;
}
