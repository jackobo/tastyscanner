import {IOptionsStrategyLegViewModel} from "./options-strategy-leg.view-model.interface";
import {OrderType, TimeInForce} from "../services/brokers/interfaces/open-order-request.interface";


export interface IOptionsStrategyViewModel {
    readonly strategyName: string;
    readonly key: string;
    readonly wingsWidth: number;
    readonly credit: number;
    readonly riskRewardRatio: number;
    readonly pop: number;
    readonly delta: number;
    readonly theta: number;
    readonly legs: IOptionsStrategyLegViewModel[];
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