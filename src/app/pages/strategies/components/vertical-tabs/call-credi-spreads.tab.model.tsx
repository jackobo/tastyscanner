import React from "react";
import {ITickerViewModel} from "../../../../models/ticker.view-model.interface";
import {CallCreditSpreadsComponent} from "../credit-spreads/call-credit-spreads.component";
import {StrategyBaseTab} from "./strategy-base.tab.model";

export class CallCreditSpreadsTabModel extends StrategyBaseTab {


    get key(): string {
        return "CallCreditSpreads";
    }
    getTitle(): string {
        return "Call Credit Spreads";
    }

    renderTickerStrategies(ticker: ITickerViewModel): React.ReactElement {
        return (<CallCreditSpreadsComponent ticker={ticker} onTrade={() => {}}/>);
    }

}