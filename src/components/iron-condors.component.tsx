import React from 'react';
import {IOptionsExpirationVewModel} from "../models/options-expiration.view-model.interface";
import {observer} from "mobx-react-lite";
import {IIronCondorViewModel} from "../models/iron-condor.view-model.interface";
import {IOptionViewModel} from "../models/option.view-model.interface";
import styled from "styled-components";
import {useServices} from "../hooks/use-services.hook";
import { IonCard } from '@ionic/react';

const ContainerBox = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`
const CondorsBox = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
`

const CondorLegBox = styled.div<{$isSell: boolean}>`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    background-color: ${props => props.$isSell ? '#ff0000' : '#00ff00'};
    border-radius: 8px;
    padding: 4px 8px;
`

const CondorLegsBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 24px;
`

const CondorFooterBox = styled.div`
    display: flex;
    flex-direction: row;
    gap: 16px;
`

const CondorLegComponent: React.FC<{option: IOptionViewModel; isSellOption: boolean}> = observer((props) => {
    return (
        <CondorLegBox $isSell={props.isSellOption}>
            <span>{props.isSellOption ? "STO" : "BTO"}</span>
            <span>{props.option.optionType}</span>
            <span>{props.option.strikePrice}</span>
            <span>{props.isSellOption ? props.option.lastPrice : -1 * props.option.lastPrice}</span>
            <span>{props.option.delta}</span>
        </CondorLegBox>
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


                <CondorFooterBox>
                    <span>Credit:</span>
                    <span>{props.condor.credit}</span>
                    <span>Risk/Reward:</span>
                    <span>{props.condor.riskRewardRatio}</span>
                </CondorFooterBox>


            </CondorLegsBox>

        </IonCard>
    )
})

const ExpirationIronCondorsComponent: React.FC<{expiration: IOptionsExpirationVewModel}> = observer((props) => {

    const condors = props.expiration.ironCondors.slice(0, 4);
    return (
        <ContainerBox>
            <div>{props.expiration.expirationDate}</div>
            <CondorsBox>
                {condors.map(condor => <CondorComponent condor={condor}/>)}
            </CondorsBox>

        </ContainerBox>
    )
});

export const IronCondorsComponent: React.FC = observer(() => {
    const services = useServices();

    const ticker = services.optionsChains.currentTicker;

    const expirations = ticker.expirations.filter(e => e.expirationDate === "2026-01-16");

    return <React.Fragment>
        {expirations.map(expiration => <ExpirationIronCondorsComponent key={expiration.expirationDate} expiration={expiration}/>)}
    </React.Fragment>
})