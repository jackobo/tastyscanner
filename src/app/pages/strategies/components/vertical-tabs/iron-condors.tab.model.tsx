import React from "react";
import {IronCondorsComponent} from "../condors/iron-condors.component";
import {ITickerViewModel} from "../../../../models/ticker/ticker.view-model.interface";
import {StrategyBaseTab} from "./strategy-base.tab.model";

export class IronCondorsTabModel extends StrategyBaseTab {

    get key(): string {
        return "IronCondors";
    }
    getTitle(): string {
        return `${this.services.tickers.currentTicker?.symbol} Iron Condors`;
    }

    renderTickerStrategies(ticker: ITickerViewModel): React.ReactElement {
        return (
            <IronCondorsComponent ticker={ticker}/>
        )
    }

}