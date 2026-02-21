import React from "react";
import {observer} from "mobx-react-lite";
import {TastyScannerStandardPage} from "../tasty-scanner-standard.page";
import {TickerOptionsStrategiesComponent} from "./components/ticker-options-strategies.component";
import styled from "styled-components";

const ContainerBox = styled.div`
    position: absolute;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px;
`

export const StrategiesPage: React.FC = observer(() => {
    return (
        <TastyScannerStandardPage>
            <ContainerBox>
                <TickerOptionsStrategiesComponent/>
            </ContainerBox>
        </TastyScannerStandardPage>
    )
});


