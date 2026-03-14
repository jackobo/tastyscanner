import {VerticalTabModel} from "../../../../components/vertical-tabs/vertical-tab.model";
import React from "react";
import {ITickerViewModel} from "../../../../models/ticker/ticker.view-model.interface";
import {FullContainerBox} from "../../../../../framework/components/full-container-box/full-container.box";

export abstract class StrategyBaseTab extends VerticalTabModel {

    protected abstract renderTickerStrategies(ticker: ITickerViewModel): React.ReactElement;

    renderContent(): React.ReactNode {
        const ticker = this.services.tickers.currentTicker;
        if (!ticker) return (
            <FullContainerBox>
                {this.services.language.translate("No ticker selected")}
            </FullContainerBox>
        )
        return this.renderTickerStrategies(ticker);
    }


}