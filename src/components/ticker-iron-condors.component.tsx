import React from 'react';
import {IOptionsExpirationVewModel} from "../models/options-expiration.view-model.interface";
import {observer} from "mobx-react-lite";
import {IIronCondorViewModel} from "../models/iron-condor.view-model.interface";
import {IOptionViewModel} from "../models/option.view-model.interface";
import styled from "styled-components";
import {useServices} from "../hooks/use-services.hook";
import { IonCard, IonChip } from '@ionic/react';

const ContainerBox = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    border: 1px solid var(--ion-color-light-shade);
    border-radius: 8px;
`

const ExpirationHeaderBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    background-color: var(--ion-color-primary);
    color: var(--ion-color-primary-contrast);
    
`

const ExpirationCondorsBox = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    padding: 12px;
`

const CondorLegBox = styled.div<{$isSell: boolean}>`
    display: grid;
    grid-template-columns: auto auto 1fr 1fr auto;
    gap: 16px;
    background-color: ${props => props.$isSell ? 'var(--ion-color-danger)' : 'var(--ion-color-success)'};
    color: ${props => props.$isSell ? 'var(--ion-color-danger-contrast)' : 'var(--ion-color-success-contrast)'};
    border-radius: 8px;
    padding: 4px 8px;
    text-align: center;
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

const CondorLegComponent: React.FC<{option: IOptionViewModel; isSellOption: boolean}> = observer((props) => {
    const price = props.isSellOption ? props.option.lastPrice : -1 * props.option.lastPrice
    return (
        <CondorLegBox $isSell={props.isSellOption}>
            <span>{props.isSellOption ? "STO" : "BTO"}</span>
            <span>{props.option.optionType}</span>
            <StrikePriceBox>{props.option.strikePrice}</StrikePriceBox>
            <OptionPriceBox>{`${price}$`}</OptionPriceBox>
            <span>{props.option.delta + '\u0394'}</span>
        </CondorLegBox>
    )
})

const CondorFooterComponent: React.FC<{condor: IIronCondorViewModel}> = observer((props) => {
    return (
        <CondorFooterBox>
            <span>Wings:</span>
            <span>{`${props.condor.wingsWidth}$`}</span>
            <span>Credit:</span>
            <span>{`${props.condor.credit}$`}</span>
            <span>Risk/Reward:</span>
            <span>{props.condor.riskRewardRatio}</span>
            <span>POP:</span>
            <span>{`${props.condor.pop}%`}</span>
        </CondorFooterBox>
    )
})

const CondorComponent: React.FC<{condor: IIronCondorViewModel}> = observer((props) => {
    return (
        <IonCard>
            <CondorLegsBox>
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
        <ContainerBox>
            <ExpirationHeaderBox>
                {`${props.expiration.expirationDate} (${props.expiration.daysToExpiration} days) - ${props.expiration.expirationType}`}
                <CondorsCountBox>
                    {condors.length}
                </CondorsCountBox>
            </ExpirationHeaderBox>
            <ExpirationCondorsBox>
                {condors.map(condor => <CondorComponent key={condor.key} condor={condor}/>)}
            </ExpirationCondorsBox>

        </ContainerBox>
    )
});

export const TickerIronCondorsComponent: React.FC = observer(() => {
    const services = useServices();

    const ticker = services.optionsChains.currentTicker;

    const expirations = ticker.getExpirationsWithIronCondors()

    return <React.Fragment>
        {expirations.map(expiration => <ExpirationIronCondorsComponent key={expiration.expirationDate} expiration={expiration}/>)}
    </React.Fragment>
})