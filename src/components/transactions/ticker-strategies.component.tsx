import React from "react";
import {observer} from "mobx-react";
import {useServices} from "../../hooks/use-services.hook";
import {IonSpinner} from "@ionic/react";
import styled from "styled-components";
import {IronCondorsComponent} from "./iron-condors.component";

const SpinnerContainerBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
`


export const TickerStrategiesComponent: React.FC = observer(() => {
    const services = useServices();

    const ticker = services.tickers.currentTicker;

    if(!ticker) {
        return null;
    }

    if(ticker.isLoading) {
        return (
            <SpinnerContainerBox>
                <IonSpinner name="circles"/>
            </SpinnerContainerBox>

        )
    }

    return (
        <IronCondorsComponent ticker={ticker} />
    )
})