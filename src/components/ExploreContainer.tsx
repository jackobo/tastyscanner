import React from 'react';
import './ExploreContainer.css';
import styled from "styled-components";
import {observer} from "mobx-react-lite";
//import {OptionsChainComponent} from "./options-chain.component";
import {TickerIronCondorsComponent} from "./ticker-iron-condors.component";

const ContainerBox = styled.div`
    position: absolute;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 24px;
`

const ExploreContainer: React.FC = observer(() => {

    return (
        <ContainerBox>
            {/*<OptionsChainComponent/>*/}
            <TickerIronCondorsComponent/>
        </ContainerBox>

    );
});

export default ExploreContainer;
