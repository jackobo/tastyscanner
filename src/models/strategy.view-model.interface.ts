export interface IStrategyViewModel {
    readonly key: string;
    readonly wingsWidth: number;
    readonly credit: number;
    readonly riskRewardRatio: number;
    readonly pop: number;
    sendOrder(options: IStrategySendOrderParams): Promise<void>;
}

export interface IStrategySendOrderParams {
    quantity: number;
    price?: number;
}