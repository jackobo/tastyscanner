import React from 'react';
import {IOptionsExpirationVewModel} from "../../models/options-expiration.view-model.interface";
import {observer} from "mobx-react-lite";
import {IIronCondorViewModel} from "../../models/iron-condor.view-model.interface";
import styled from "styled-components";
import {useServices} from "../../hooks/use-services.hook";
import {IonAccordionGroup, IonCard, IonSpinner} from '@ionic/react';
import {TransactionHeaderComponent} from "./transaction-header.component";
import {TransactionLegComponent} from "./transaction-leg.component";

import {TransactionFooterComponent} from "./transaction-footer.component";
import {ExpirationTransactionsComponent} from "./expiration-transactions.component";


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
                <TransactionHeaderComponent/>
                <TransactionLegComponent option={props.condor.btoPut} isSellOption={false}/>
                <TransactionLegComponent option={props.condor.stoPut} isSellOption={true}/>
                <TransactionLegComponent option={props.condor.stoCall} isSellOption={true}/>
                <TransactionLegComponent option={props.condor.btoCall} isSellOption={false}/>
                <TransactionFooterComponent transaction={props.condor}/>
            </CondorBox>
        </IonCard>
    )
})

const ExpirationIronCondorsComponent: React.FC<{expiration: IOptionsExpirationVewModel}> = observer((props) => {

    const condors = props.expiration.ironCondors;

    return (
        <ExpirationTransactionsComponent expiration={props.expiration} transactionsCount={condors.length}>
            {condors.map(condor => <CondorComponent key={condor.key} condor={condor}/>)}
        </ExpirationTransactionsComponent>
    );
});

export const TickerIronCondorsComponent: React.FC = observer(() => {
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