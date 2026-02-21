import React from "react";
import {ITickerViewModel} from "../models/ticker.view-model.interface";
import {TradingViewWidgetComponent} from "./trading-view-widget.component";
import {observer} from "mobx-react";
import {useServices} from "../hooks/use-services.hook";



export const TickerChartComponent: React.FC<{ticker: ITickerViewModel | null}> = observer((props) => {
    const services = useServices();
    if(!props.ticker) {
        return (
            <div>
                {services.language.translate('No ticker selected.')}
            </div>
        );
    }
    return (
        <TradingViewWidgetComponent symbol={props.ticker.symbol} listedMarket={props.ticker.listedMarket}/>
    )

})