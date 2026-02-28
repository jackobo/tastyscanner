import {IOptionViewModel} from "./option.view-model.interface";

export type StrategyLegActionType = 'BTO' | 'STO';

export interface IOptionsStrategyLegViewModel {
    readonly key: string;
    readonly option: IOptionViewModel;
    readonly legActionType: StrategyLegActionType;
    readonly isSell: boolean;
    readonly isBuy: boolean;
    readonly hasOppositePositions: boolean;
    readonly countExistingSameDirectionPositions: number;
}
