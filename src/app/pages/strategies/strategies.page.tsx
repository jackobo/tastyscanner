import React from "react";
import ExploreContainer from '../../components/ExploreContainer';
import {observer} from "mobx-react-lite";
import {TastyScannerStandardPage} from "../tasty-scanner-standard.page";

export const StrategiesPage: React.FC = observer(() => {
    return (
        <TastyScannerStandardPage renderHeader={() => "Home"}>
            <ExploreContainer />
        </TastyScannerStandardPage>
    )
});


