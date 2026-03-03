import {ITickerViewModel} from "../../../../models/ticker.view-model.interface";

export interface IRecentTickerMenuItemViewModel {
    readonly ticker: ITickerViewModel;
    isHovered: boolean;
}