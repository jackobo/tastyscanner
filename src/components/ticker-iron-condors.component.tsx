import React from 'react';
import {IOptionsExpirationVewModel} from "../models/options-expiration.view-model.interface";
import {observer} from "mobx-react-lite";
import {IIronCondorViewModel} from "../models/iron-condor.view-model.interface";
import {IOptionViewModel} from "../models/option.view-model.interface";
import styled from "styled-components";
import {useServices} from "../hooks/use-services.hook";
import {IonAccordion, IonAccordionGroup, IonCard, IonChip, IonItem, IonLabel, IonSpinner} from '@ionic/react';


const ExpirationHeaderItemBox = styled(IonItem)`
    cursor: pointer;
    
`

const ExpirationHeaderItemContentBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
    padding: 8px 16px;
`

const ExpirationCondorsBox = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    padding: 12px;
`

const CondorLegBaseBox = styled.div`
    display: grid;
    grid-template-columns: 30px 24px 1fr 1fr auto auto;
    gap: 16px;
    border-radius: 8px;
    padding: 4px 8px;
    text-align: center;
`

const CondorLegHeaderBox = styled(CondorLegBaseBox)`
    background-color: var(--ion-color-medium);
    color: var(--ion-color-medium-contrast);
`

const CondorLegBox = styled(CondorLegBaseBox)<{$isSell: boolean}>`
    background-color: ${props => props.$isSell ? 'var(--ion-color-danger)' : 'var(--ion-color-success)'};
    color: ${props => props.$isSell ? 'var(--ion-color-danger-contrast)' : 'var(--ion-color-success-contrast)'};
`

const CondorLegsBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 24px;
`

const CondorFooterBox = styled.div`
    display: grid;
    grid-template-columns: 1fr 0.5fr 1fr 1fr;
    row-gap: 8px;
    column-gap: 16px;
    font-weight: bold;
    color: var(--ion-color-primary);
`

const CondorsCountBox = styled(IonChip)`
    --background: var(--ion-color-tertiary);
    --color: var(--ion-color-tertiary-contrast);
`


const OptionPriceBox = styled.span`
    text-align: right;
`

const StrikePriceBox = styled.span`
    text-align: center;
    width: 100%;
`

const SpinnerContainerBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
`

const CondorLegComponent: React.FC<{option: IOptionViewModel; isSellOption: boolean}> = observer((props) => {
    const price = props.isSellOption ? props.option.lastPrice : -1 * props.option.lastPrice
    return (
        <CondorLegBox $isSell={props.isSellOption}>
            <span>{props.isSellOption ? "STO" : "BTO"}</span>
            <span>{props.option.optionType}</span>
            <StrikePriceBox>{props.option.strikePrice}</StrikePriceBox>
            <OptionPriceBox>{`${price.toFixed(2)}$`}</OptionPriceBox>
            <span>{props.option.delta + '\u0394'}</span>
            <span>{props.option.bidAskSpread.toFixed(2) + '%'}</span>
        </CondorLegBox>
    )
})

const CondorFooterComponent: React.FC<{condor: IIronCondorViewModel}> = observer((props) => {
    return (
        <CondorFooterBox>
            <span>Risk/Reward:</span>
            <span>{props.condor.riskRewardRatio}</span>
            <span>POP:</span>
            <span>{`${props.condor.pop}%`}</span>
            <span>Wings:</span>
            <span>{`${props.condor.wingsWidth}$`}</span>
            <span>Credit:</span>
            <span>{`${props.condor.credit.toFixed(2)}$`}</span>

        </CondorFooterBox>
    )
})

const CondorComponent: React.FC<{condor: IIronCondorViewModel}> = observer((props) => {
    return (
        <IonCard>
            <CondorLegsBox>
                <CondorLegHeaderBox>
                    <span></span>
                    <span></span>
                    <span>strike</span>
                    <span>last</span>
                    <span>{'\u0394'}</span>
                    <span>spread</span>
                </CondorLegHeaderBox>
                <CondorLegComponent option={props.condor.btoPut} isSellOption={false}/>
                <CondorLegComponent option={props.condor.stoPut} isSellOption={true}/>
                <CondorLegComponent option={props.condor.stoCall} isSellOption={true}/>
                <CondorLegComponent option={props.condor.btoCall} isSellOption={false}/>
                <CondorFooterComponent condor={props.condor}/>

            </CondorLegsBox>

        </IonCard>
    )
})

const ExpirationIronCondorsComponent: React.FC<{expiration: IOptionsExpirationVewModel}> = observer((props) => {

    const condors = props.expiration.ironCondors;
    return (
        <IonAccordion value={props.expiration.expirationDate}>

            <ExpirationHeaderItemBox slot="header" color="light">
                <ExpirationHeaderItemContentBox>
                    <CondorsCountBox>
                        {condors.length}
                    </CondorsCountBox>
                    <IonLabel>
                        {`${props.expiration.expirationDate} (${props.expiration.daysToExpiration} days) - ${props.expiration.expirationType}`}
                    </IonLabel>

                </ExpirationHeaderItemContentBox>
            </ExpirationHeaderItemBox>

            <ExpirationCondorsBox slot="content">
                {condors.map(condor => <CondorComponent key={condor.key} condor={condor}/>)}
            </ExpirationCondorsBox>

        </IonAccordion>
    )
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