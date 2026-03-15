import {IOptionViewModel} from "./option.view-model.interface";
import {OrderSimpleLegActionType} from "../services/brokers/interfaces/open-order-request.interface";



export interface IOptionsStrategyLegViewModel {
    readonly key: string;
    readonly option: IOptionViewModel;
    readonly legActionType: OrderSimpleLegActionType;
    readonly isSell: boolean;
    readonly isBuy: boolean;
    readonly hasOppositePositions: boolean;
    readonly countExistingSameDirectionPositions: number;
}
