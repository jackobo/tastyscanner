export interface IOptionViewModel {
    readonly optionType: string;
    readonly strikePrice: number;
    readonly lastPrice: number;
    readonly delta: number;
}