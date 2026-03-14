
export interface TickerInfoViewModel {
    readonly description: string;
    readonly listedMarket: string;
    getOptionTickSize(orderPrice: number): number;
}
