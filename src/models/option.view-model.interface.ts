export interface IOptionViewModel {
    readonly optionType: string;
    readonly strikePrice: number;
    readonly midPrice: number;
    readonly delta: number;
    readonly absoluteDelta: number;
    readonly bidAskSpread: number;
    readonly expirationDate: string;
    readonly daysToExpiration: number;
}