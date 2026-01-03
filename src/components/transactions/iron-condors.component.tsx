import React from 'react';
import {IOptionsExpirationVewModel} from "../../models/options-expiration.view-model.interface";
import {observer} from "mobx-react-lite";
import {IIronCondorViewModel} from "../../models/iron-condor.view-model.interface";
import styled from "styled-components";
import {useServices} from "../../hooks/use-services.hook";
import {IonAccordionGroup, IonCard, IonSpinner} from '@ionic/react';
import {StrategyHeaderComponent} from "./strategy-header.component";
import {StrategyLegComponent} from "./strategy-leg.component";

import {StrategyFooterComponent} from "./strategy-footer.component";
import {ExpirationStrategiesComponent} from "./expiration-strategies.component";


const CondorBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 24px;
`

const SpinnerContainerBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
`




const CondorComponent: React.FC<{condor: IIronCondorViewModel}> = observer((props) => {
    return (
        <IonCard>
            <CondorBox>
                <StrategyHeaderComponent/>
                <StrategyLegComponent option={props.condor.btoPut} isSellOption={false}/>
                <StrategyLegComponent option={props.condor.stoPut} isSellOption={true}/>
                <StrategyLegComponent option={props.condor.stoCall} isSellOption={true}/>
                <StrategyLegComponent option={props.condor.btoCall} isSellOption={false}/>
                <StrategyFooterComponent transaction={props.condor}/>
            </CondorBox>
        </IonCard>
    )
})

const ExpirationIronCondorsComponent: React.FC<{expiration: IOptionsExpirationVewModel}> = observer((props) => {

    const condors = props.expiration.ironCondors;

    return (
        <ExpirationStrategiesComponent expiration={props.expiration} transactionsCount={condors.length}>
            {condors.map(condor => <CondorComponent key={condor.key} condor={condor}/>)}
        </ExpirationStrategiesComponent>
    );
});

export const IronCondorsComponent: React.FC = observer(() => {
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

    const expirations = ticker.getExpirationsWithIronCondors()

    return  <IonAccordionGroup>
        {expirations.map(expiration => <ExpirationIronCondorsComponent key={expiration.expirationDate} expiration={expiration}/>)}
    </IonAccordionGroup>
})