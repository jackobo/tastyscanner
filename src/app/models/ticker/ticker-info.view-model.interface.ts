
export interface ITickerInfoViewModel {
    readonly description: string;
    readonly listedMarket: string;
    getOptionTickSize(orderPrice: number): number;
}
