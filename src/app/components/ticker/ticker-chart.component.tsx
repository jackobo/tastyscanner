import React from "react";
import {ITickerViewModel} from "../../models/ticker/ticker.view-model.interface";
import {TradingViewWidgetComponent} from "../charts/trading-view-widget.component";
import {observer} from "mobx-react";
import {useServices} from "../../hooks/use-services.hook";
import styled from "styled-components";

const NoTickerSelectedBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--ion-color-danger);
    width: 100%;
    height: 100%;
`


export const TickerChartComponent: React.FC<{ticker: ITickerViewModel | null}> = observer((props) => {
    const services = useServices();
    const info = props.ticker?.info;
    if(!props.ticker) {
        return (
            <NoTickerSelectedBox>
                {services.language.translate('No ticker selected.')}
            </NoTickerSelectedBox>
        );
    }

    if(!info) {
        return (
            <NoTickerSelectedBox>
                {services.language.translate('Not listed market available for selected ticker.')}
            </NoTickerSelectedBox>
        );
    }

    return (
        <TradingViewWidgetComponent symbol={props.ticker.symbol} listedMarket={info.listedMarket}/>
    )


})