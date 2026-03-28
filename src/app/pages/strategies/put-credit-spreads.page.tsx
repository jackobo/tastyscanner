import React from "react";
import {observer} from "mobx-react";
import {StrategiesPage} from "./strategies.page";
import {PutCreditSpreadsComponent} from "./components/credit-spreads/put-credit-spreads.component";

export const PutCreditSpreadsPage: React.FC = observer(() => {
    return (
        <StrategiesPage strategyName={"Put Credit Spreads"} renderContent={(ticker) =>  <PutCreditSpreadsComponent ticker={ticker}/>}/>
    )
})