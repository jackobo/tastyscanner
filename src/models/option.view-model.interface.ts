export interface IOptionViewModel {
    readonly optionType: string;
    readonly strikePrice: number;
    readonly priceForStrategyBuilder: number;
    readonly delta: number;
    readonly bidAskSpread: number;
}