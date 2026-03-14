import React from "react";
import {observer} from "mobx-react";
import {ITickerViewModel} from "../../../../models/ticker/ticker.view-model.interface";
import {AllExpirationsStrategiesComponent} from "../all-expirations-strategies.component";


export const CallCreditSpreadsComponent: React.FC<{ticker: ITickerViewModel;}> = observer((props) => {

    return (
        <AllExpirationsStrategiesComponent ticker={props.ticker}
                                           getExpirations={() => props.ticker.getExpirationsWithCallCreditSpreads()}
                                           getExpirationStrategies={(expiration) => expiration.callCreditSpreads}
                                           noStrategiesAvailableMessage="No call credit spreads available"/>
    );

})