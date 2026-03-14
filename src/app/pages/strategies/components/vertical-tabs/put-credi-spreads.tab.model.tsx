import React from "react";
import {PutCreditSpreadsComponent} from "../credit-spreads/put-credit-spreads.component";
import {ITickerViewModel} from "../../../../models/ticker/ticker.view-model.interface";
import {StrategyBaseTab} from "./strategy-base.tab.model";

export class PutCreditSpreadsTabModel extends StrategyBaseTab {

    get key(): string {
        return "PutCreditSpreads";
    }

    getTitle(): string {
        return `${this.services.tickers.currentTicker?.symbol} Put Credit Spreads`;
    }

    protected renderTickerStrategies(ticker: ITickerViewModel): React.ReactElement {
        return (
            <PutCreditSpreadsComponent ticker={ticker}/>
        )
    }

}