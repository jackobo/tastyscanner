export interface IWorkingOrderViewModel {
    readonly id: string;
    readonly underlyingSymbol: string;
    readonly tradingPrice: number;
    readonly isGobyOrder: boolean
    cancel(): Promise<void>;
}
