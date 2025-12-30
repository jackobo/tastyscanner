import React from "react";
import { observer } from "mobx-react";
import {useServices} from "../hooks/use-services.hook";
import {IonChip, IonRange } from "@ionic/react";
import styled from "styled-components";

const ConfigsContainerBox = styled.div`
    display: grid;
    grid-template-columns: auto 1fr auto;
    flex-direction: column;
    width: 100%;
    column-gap: 16px;
    padding: 16px 8px;
`

const ConfigItemLabelBox = styled.div`
    display: flex;
    align-items: center;
`

const ConfigItemValueBox = styled(IonChip)`
    text-align: center;
`

export const IronCondorSettingsComponent: React.FC = observer(() => {
    const services = useServices();

    const settings = services.settings.ironCondorScanner;

    return (
        <ConfigsContainerBox>
            <ConfigItemLabelBox>
                <span>Max risk/reward</span>
            </ConfigItemLabelBox>
            <IonRange min={1} max={10} value={settings.maxRiskRewardRatio} onIonChange={e => {
                settings.maxRiskRewardRatio = e.detail.value as number;
            }}/>
            <ConfigItemValueBox>
                {settings.maxRiskRewardRatio}
            </ConfigItemValueBox>

            <ConfigItemLabelBox>
                <span>Min delta</span>
            </ConfigItemLabelBox>
            <IonRange min={5} max={49} value={settings.minDelta} onIonChange={e => {
                settings.minDelta = e.detail.value as number;
            }}/>
            <ConfigItemValueBox>
                {settings.minDelta}
            </ConfigItemValueBox>


            <ConfigItemLabelBox>
                <span>Max delta</span>
            </ConfigItemLabelBox>
            <IonRange min={5} max={49} value={settings.maxDelta} onIonChange={e => {
                settings.maxDelta = e.detail.value as number;
            }}/>
            <ConfigItemValueBox>
                {settings.maxDelta}
            </ConfigItemValueBox>

            <ConfigItemLabelBox>
                <span>Min DTE</span>
            </ConfigItemLabelBox>
            <IonRange min={0} max={365} value={settings.minDaysToExpiration} onIonChange={e => {
                settings.minDaysToExpiration = e.detail.value as number;
            }}/>
            <ConfigItemValueBox>
                {settings.minDaysToExpiration}
            </ConfigItemValueBox>

            <ConfigItemLabelBox>
                <span>Max DTE</span>
            </ConfigItemLabelBox>
            <IonRange min={0} max={365} value={settings.maxDaysToExpiration} onIonChange={e => {
                settings.maxDaysToExpiration = e.detail.value as number;
            }}/>
            <ConfigItemValueBox>
                {settings.maxDaysToExpiration}
            </ConfigItemValueBox>

        </ConfigsContainerBox>
    )
})