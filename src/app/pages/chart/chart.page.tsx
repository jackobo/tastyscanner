import React from 'react';
import {observer} from "mobx-react";
import {useServices} from "../../hooks/use-services.hook";
import {TastyGobyStandardPage} from "../tasty-goby-standard.page";
import {TickerChartComponent} from "../../components/ticker/ticker-chart.component";

export const ChartPage: React.FC = observer(() => {
    const services = useServices();
    return (
        <TastyGobyStandardPage>
            <TickerChartComponent ticker={services.tickers.currentTicker}/>
        </TastyGobyStandardPage>
    )
})