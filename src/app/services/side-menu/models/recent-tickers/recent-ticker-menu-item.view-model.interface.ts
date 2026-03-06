import {ITickerViewModel} from "../../../../models/ticker.view-model.interface";

export interface IRecentTickerMenuItemViewModel {
    readonly ticker: ITickerViewModel;
    readonly isCurrentTicker: boolean;
    isHovered: boolean;
}