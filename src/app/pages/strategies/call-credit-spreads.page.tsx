import React from "react";
import {observer} from "mobx-react";
import {StrategiesPage} from "./strategies.page";
import {CallCreditSpreadsComponent} from "./components/credit-spreads/call-credit-spreads.component";

export const CallCreditSpreadsPage: React.FC = observer(() => {
    return (
        <StrategiesPage strategyName={"Call Credit Spreads"} renderContent={(ticker) =>  <CallCreditSpreadsComponent ticker={ticker}/>}/>
    )
})