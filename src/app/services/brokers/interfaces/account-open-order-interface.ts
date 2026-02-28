
export interface IAccountOpenOrderViewModel {
    readonly id: string;
    readonly underlyingSymbol: string;
    readonly createdAt: Date;
    readonly tradingPrice: number;
    readonly legs: IAccountOpenOrderLegViewModel[];
}

export interface IAccountOpenOrderLegViewModel {
    readonly symbol: string;
    readonly quantity: number;
    readonly instrumentType: string;
    readonly price: number;
    readonly isSell: boolean;
    readonly optionType?: "P" | "C"; //put / call


    //readonly action: string;
    //readonly tradePrice: string;

}