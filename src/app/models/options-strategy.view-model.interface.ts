import {IOptionsStrategyLegViewModel} from "./options-strategy-leg.view-model.interface";
import {OrderType, TimeInForce} from "../services/brokers/interfaces/open-order-request.interface";

export interface IOptionsStrategyWithAnnotationsViewModel<TStrategy extends IOptionsStrategyViewModel> {
    strategy: TStrategy;
    isBestPOP: boolean;
    isBestRiskReward: boolean;
}

export interface IOptionsStrategyCreditsViewModel {
    readonly description: string;
    readonly credit: number;
}

export interface IOptionsStrategyViewModel {
    readonly strategyName: string;
    readonly key: string;
    readonly wingsWidth: number;
    readonly totalCredit: number;
    readonly credits: IOptionsStrategyCreditsViewModel[];
    readonly riskRewardRatio: number;
    readonly pop: number;
    readonly delta: number;
    readonly shortLegsDelta: number;
    readonly theta: number;
    readonly legs: IOptionsStrategyLegViewModel[];
    readonly hasLegsWithExistingPositions: boolean;
    getOptionTickSize(price: number): number;
    sendOrder(options: IOptionsStrategySendOrderParams): Promise<void>;
}


export interface IOptionsStrategySendOrderParams {
    quantity: number;
    price?: number;
    timeInForce: TimeInForce;
    orderType: OrderType;
    enableAutoReplace: boolean
}