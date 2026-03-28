import React from "react";
import {observer} from "mobx-react";
import {StrategiesPage} from "./strategies.page";
import {IronCondorsComponent} from "./components/condors/iron-condors.component";

export const IronCondorsPage: React.FC = observer(() => {
    return (
        <StrategiesPage strategyName={"Iron Condors"} renderContent={(ticker) => <IronCondorsComponent ticker={ticker}/>}/>
    )
})