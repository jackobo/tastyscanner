import React from "react";
import { observer } from "mobx-react";
import {useServices} from "../hooks/use-services.hook";
import {IonChip, IonRange, IonToggle } from "@ionic/react";
import styled from "styled-components";

const FiltersContainerBox = styled.div`
    display: grid;
    grid-template-columns: auto 1fr auto;
    flex-direction: column;
    width: 100%;
    column-gap: 16px;
    row-gap: 8px;
    padding: 16px 8px;
`

const FilterLabelBox = styled.div`
    display: flex;
    align-items: center;
`

const FilterValueBox = styled(IonChip)`
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
    const isChecked = services.settings.ironCondorFilters.wings.includes(props.value);
    const onToggleHandle = (checked: boolean) => {
        const wings = [...services.settings.ironCondorFilters.wings];
        if(checked) {
            wings.push(props.value);
            services.settings.ironCondorFilters.wings = wings.sort((a, b) => a - b);
        } else {
            services.settings.ironCondorFilters.wings = wings.filter(w => w !== props.value);
        }
    }
    return (
        <IonToggle checked={isChecked} labelPlacement={"stacked"}
                   onIonChange={e => onToggleHandle(e.detail.checked)}>
            {`${props.value}$`}
        </IonToggle>
    )
})

interface StandardIronCondorFilterComponentProps {
    label: string;
    min: number;
    max: number;
    value: number;
    onValueChanged: (value: number) => void;
}
const StandardIronCondorFilterComponent: React.FC<StandardIronCondorFilterComponentProps> = observer((props) => {
    return (
        <React.Fragment>
            <FilterLabelBox>
                {props.label}
            </FilterLabelBox>
            <IonRange min={props.min} max={props.max} value={props.value} onIonChange={e => {
                props.onValueChanged(e.detail.value as number)
            }}/>
            <FilterValueBox>
                {props.value}
            </FilterValueBox>
        </React.Fragment>
    )
})

export const IronCondorFiltersComponent: React.FC = observer(() => {
    const services = useServices();

    const filters = services.settings.ironCondorFilters;

    return (
        <FiltersContainerBox>
            <StandardIronCondorFilterComponent label="Max risk/reward"
                                               min={1}
                                               max={10}
                                               value={filters.maxRiskRewardRatio}
                                               onValueChanged={value => filters.maxRiskRewardRatio = value}/>


            <StandardIronCondorFilterComponent label="Min delta"
                                               min={5}
                                               max={49}
                                               value={filters.minDelta}
                                               onValueChanged={value => filters.minDelta = value}/>


            <StandardIronCondorFilterComponent label="Max delta"
                                               min={5}
                                               max={49}
                                               value={filters.maxDelta}
                                               onValueChanged={value => filters.maxDelta = value}/>

            <StandardIronCondorFilterComponent label="Min DTE"
                                               min={0}
                                               max={365}
                                               value={filters.minDaysToExpiration}
                                               onValueChanged={value => filters.minDaysToExpiration = value}/>

            <StandardIronCondorFilterComponent label="Max DTE"
                                               min={0}
                                               max={365}
                                               value={filters.maxDaysToExpiration}
                                               onValueChanged={value => filters.maxDaysToExpiration = value}/>

            <StandardIronCondorFilterComponent label="Max bid/ask spread"
                                               min={0}
                                               max={10}
                                               value={filters.maxBidAskSpread}
                                               onValueChanged={value => filters.maxBidAskSpread = value}/>

            <FilterLabelBox>
                Wings
            </FilterLabelBox>
            <WingsEditorBox>
                {filters.availableWings.map(w => <WingValueComponent key={w} value={w}/>)}
            </WingsEditorBox>

        </FiltersContainerBox>
    )
})