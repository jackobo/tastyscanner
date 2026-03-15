export type OptionType = 'C' | 'P'; //call or put
export interface IOptionViewModel {
    readonly symbol: string;
    readonly streamerSymbol: string;
    readonly optionType: OptionType;
    readonly strikePrice: number;
    readonly midPrice: number;
    readonly rawDelta: number;
    readonly absoluteRawDelta: number;
    readonly deltaPercent: number;
    readonly absoluteDeltaPercent: number;
    readonly theta: number;
    readonly bidAskSpread: number;
    readonly expirationDate: string;
    readonly daysToExpiration: number;
    readonly countSells: number;
    readonly countBuys: number;

}