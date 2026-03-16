import React from "react";
import {observer} from "mobx-react";
import {FilterLabelBox} from "../../boxes/filter-label.box";
import styled from "styled-components";
import {useServices} from "../../../../hooks/use-services.hook";
import {IonToggle} from "@ionic/react";
import {IStrategyFiltersViewModel} from "../../../../services/strategy-settings/strategy-settings.service.interface";

const WingsEditorBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
`

const WingValueComponent: React.FC<{value: number}> = observer((props) => {
    const services = useServices();
    const isChecked = services.strategySettings.strategyFilters.wings.includes(props.value);
    const onToggleHandle = (checked: boolean) => {
        const wings = [...services.strategySettings.strategyFilters.wings];
        if(checked) {
            wings.push(props.value);
            services.strategySettings.strategyFilters.wings = wings.sort((a, b) => a - b);
        } else {
            services.strategySettings.strategyFilters.wings = wings.filter(w => w !== props.value);
        }
    }
    return (
        <IonToggle checked={isChecked} labelPlacement={"stacked"}
                   onIonChange={e => onToggleHandle(e.detail.checked)}>
            {`${props.value}$`}
        </IonToggle>
    )
})

export const WingsWidthFilterComponent: React.FC<{filters: IStrategyFiltersViewModel}> = observer((props) => {
    const filters = props.filters;
    return (
        <>
            <FilterLabelBox>
                Wings/Spread size
            </FilterLabelBox>
            <WingsEditorBox>
                {filters.availableWings.map(w => <WingValueComponent key={w} value={w}/>)}
            </WingsEditorBox>
        </>
    )
})