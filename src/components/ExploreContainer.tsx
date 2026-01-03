import React from 'react';
import './ExploreContainer.css';
import styled from "styled-components";
import {observer} from "mobx-react-lite";
//import {OptionsChainComponent} from "./tickers.component";
import {IronCondorsComponent} from "./transactions/iron-condors.component";
import {TickerStrategiesComponent} from "./transactions/ticker-strategies.component";

const ContainerBox = styled.div`
    position: absolute;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px;
`

const ExploreContainer: React.FC = observer(() => {

    return (
        <ContainerBox>
            {/*<OptionsChainComponent/>*/}
            <TickerStrategiesComponent/>
        </ContainerBox>

    );
});

export default ExploreContainer;
