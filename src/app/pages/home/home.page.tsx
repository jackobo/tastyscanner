import React from "react";
import ExploreContainer from '../../components/ExploreContainer';
import {observer} from "mobx-react-lite";
import {useServices} from "../../hooks/use-services.hook";
import {TickerChartComponent} from "../../components/ticker-chart.component";
import {TastyScannerStandardPage} from "../tasty-scanner-standard.page";

export const HomePage: React.FC = observer(() => {
    const services = useServices();
    return (
        <TastyScannerStandardPage renderHeader={() => "Home"}>
            <TickerChartComponent ticker={services.tickers.currentTicker}/>
            <ExploreContainer />
        </TastyScannerStandardPage>
    )
});


