import React from "react";
import {observer} from "mobx-react";
import {
    IRecentTickerMenuItemViewModel
} from "../../services/side-menu/models/recent-tickers/recent-ticker-menu-item.view-model.interface";

interface RecentTickerMenuItemComponentProps {
    menuItem: IRecentTickerMenuItemViewModel;
}
export const RecentTickerMenuItemComponent: React.FC<RecentTickerMenuItemComponentProps> = observer((props) => {
    return (
        <div>
            {props.menuItem.ticker.symbol}
        </div>
    )
})