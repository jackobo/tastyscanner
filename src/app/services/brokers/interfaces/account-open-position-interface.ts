
export interface IAccountOpenPositionViewModel {
    readonly id: string;
    readonly underlyingSymbol: string;
    readonly createdAt: Date;
    readonly tradingPrice: number;
    readonly legs: IAccountOpenPositionLegViewModel[];
}

export interface IAccountOpenPositionLegViewModel {
    readonly symbol: string;
    readonly quantity: number;
    readonly instrumentType: string;
    readonly price: number;

    //readonly action: string;
    //readonly tradePrice: string;

}