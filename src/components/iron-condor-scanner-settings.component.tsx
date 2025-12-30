import React from "react";
import { observer } from "mobx-react";
import {useServices} from "../hooks/use-services.hook";
import {IonChip, IonRange, IonToggle } from "@ionic/react";
import styled from "styled-components";

const ConfigsContainerBox = styled.div`
    display: grid;
    grid-template-columns: auto 1fr auto;
    flex-direction: column;
    width: 100%;
    column-gap: 16px;
    row-gap: 8px;
    padding: 16px 8px;
`

const ConfigItemLabelBox = styled.div`
    display: flex;
    align-items: center;
`

const ConfigItemValueBox = styled(IonChip)`
    text-align: center;
`

const WingsEditorBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    column-span: 2/-1;
`

const WingValueComponent: React.FC<{value: number}> = observer((props) => {
    const services = useServices();
    const isChecked = services.settings.ironCondorScanner.wings.includes(props.value);
    const onToggleHandle = (checked: boolean) => {
        const wings = [...services.settings.ironCondorScanner.wings];
        if(checked) {
            wings.push(props.value);
            services.settings.ironCondorScanner.wings = wings.sort((a, b) => a - b);
        } else {
            services.settings.ironCondorScanner.wings = wings.filter(w => w !== props.value);
        }
    }
    return (
        <IonToggle checked={isChecked} onIonChange={e => onToggleHandle(e.detail.checked)}>
            {`${props.value}$`}
        </IonToggle>
    )
})

export const IronCondorScannerSettingsComponent: React.FC = observer(() => {
    const services = useServices();

    const settings = services.settings.ironCondorScanner;

    return (
        <ConfigsContainerBox>
            <ConfigItemLabelBox>
                Max risk/reward
            </ConfigItemLabelBox>
            <IonRange min={1} max={10} value={settings.maxRiskRewardRatio} onIonChange={e => {
                settings.maxRiskRewardRatio = e.detail.value as number;
            }}/>
            <ConfigItemValueBox>
                {settings.maxRiskRewardRatio}
            </ConfigItemValueBox>

            <ConfigItemLabelBox>
                Min delta
            </ConfigItemLabelBox>
            <IonRange min={5} max={49} value={settings.minDelta} onIonChange={e => {
                settings.minDelta = e.detail.value as number;
            }}/>
            <ConfigItemValueBox>
                {settings.minDelta}
            </ConfigItemValueBox>


            <ConfigItemLabelBox>
                Max delta
            </ConfigItemLabelBox>
            <IonRange min={5} max={49} value={settings.maxDelta} onIonChange={e => {
                settings.maxDelta = e.detail.value as number;
            }}/>
            <ConfigItemValueBox>
                {settings.maxDelta}
            </ConfigItemValueBox>

            <ConfigItemLabelBox>
                Min DTE
            </ConfigItemLabelBox>
            <IonRange min={0} max={365} value={settings.minDaysToExpiration} onIonChange={e => {
                settings.minDaysToExpiration = e.detail.value as number;
            }}/>
            <ConfigItemValueBox>
                {settings.minDaysToExpiration}
            </ConfigItemValueBox>

            <ConfigItemLabelBox>
                Max DTE
            </ConfigItemLabelBox>
            <IonRange min={0} max={365} value={settings.maxDaysToExpiration} onIonChange={e => {
                settings.maxDaysToExpiration = e.detail.value as number;
            }}/>
            <ConfigItemValueBox>
                {settings.maxDaysToExpiration}
            </ConfigItemValueBox>

            <ConfigItemLabelBox>
                Max bid/ask spread
            </ConfigItemLabelBox>
            <IonRange min={0} max={20} value={settings.maxBidAskSpread} onIonChange={e => {
                settings.maxBidAskSpread = e.detail.value as number;
            }}/>
            <ConfigItemValueBox>
                {`${settings.maxBidAskSpread}%`}
            </ConfigItemValueBox>

            <ConfigItemLabelBox>
                Wings
            </ConfigItemLabelBox>
            <WingsEditorBox>
                {settings.availableWings.map(w => <WingValueComponent key={w} value={w}/>)}
            </WingsEditorBox>

        </ConfigsContainerBox>
    )
})