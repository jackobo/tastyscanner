import {VerticalTabModel} from "../../../../components/vertical-tabs/vertical-tab.model";
import React from "react";
import {ITickerViewModel} from "../../../../models/ticker.view-model.interface";

export abstract class StrategyBaseTab extends VerticalTabModel {

    protected abstract renderTickerStrategies(ticker: ITickerViewModel): React.ReactElement;

    renderContent(): React.ReactNode {
        const ticker = this.services.tickers.currentTicker;
        if (!ticker) return (
            <div>No ticker selected</div>
        )
        return this.renderTickerStrategies(ticker);
    }


}