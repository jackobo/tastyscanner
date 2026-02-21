import React from 'react';
import {observer} from "mobx-react";
import {useServices} from "../../hooks/use-services.hook";
import {TastyScannerStandardPage} from "../tasty-scanner-standard.page";
import {TickerChartComponent} from "../../components/ticker-chart.component";

export const ChartPage: React.FC = observer(() => {
    const services = useServices();
    return (
        <TastyScannerStandardPage>
            <TickerChartComponent ticker={services.tickers.currentTicker}/>
        </TastyScannerStandardPage>
    )
})