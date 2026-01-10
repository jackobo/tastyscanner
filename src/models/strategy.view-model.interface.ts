import {OrderType, TimeInForce} from "../services/broker-account/broker-account.service.interface";
import {IOptionsStrategyLegViewModel} from "./options-strategy-leg.view-model.interface";


export interface IStrategyViewModel {
    readonly strategyName: string;
    readonly key: string;
    readonly wingsWidth: number;
    readonly credit: number;
    readonly riskRewardRatio: number;
    readonly pop: number;
    readonly legs: IOptionsStrategyLegViewModel[];
    sendOrder(options: IStrategySendOrderParams): Promise<void>;
}


export interface IStrategySendOrderParams {
    quantity: number;
    price?: number;
    timeInForce: TimeInForce;
    orderType: OrderType;
}