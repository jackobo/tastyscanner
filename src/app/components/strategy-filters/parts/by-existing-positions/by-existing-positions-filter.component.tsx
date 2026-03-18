import React from "react";
import {observer} from "mobx-react";
import {IonRadio} from "@ionic/react";
import styled from "styled-components";
import {IStrategyFiltersViewModel} from "../../../../services/strategy-settings/strategy-settings.service.interface";
import {RadioGroupBox} from "../../boxes/radio-group.box";
import {FilterContainerComponent} from "../../common/filter-container/filter-container.component";
import {FilterLabelComponent} from "../../common/filter-label/filter-label.component";
import {useServices} from "../../../../hooks/use-services.hook";

const LabelBox = styled(FilterLabelComponent)`
    padding-bottom: var(--ion-space-16);
`

const ByEarningDateRadioGroupBox = styled(RadioGroupBox)`
    & .radio-group-wrapper {
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        gap: 8px;
        width: 100%;
        
    }
    padding-bottom: var(--ion-space-12);
`


export const ByExistingPositionsFilterComponent: React.FC<{filters: IStrategyFiltersViewModel}> = observer((props) => {
    const filters = props.filters;
    const services = useServices();
    return (
        <FilterContainerComponent>
            <LabelBox tooltip={services.language.translate('Decide if you want to include or not strategies with legs that you already have open position on them.')}>
                {services.language.translate('Strategies with existing positions')}
            </LabelBox>

            <ByEarningDateRadioGroupBox value={filters.byExistingPositions}
                                        onIonChange={e => filters.byExistingPositions = e.detail.value}>
                <IonRadio value={"exclude"} labelPlacement="end">
                    {services.language.translate('Exclude')}
                </IonRadio>

                <IonRadio value={"include"} labelPlacement="end">
                    {services.language.translate('Include')}
                </IonRadio>
            </ByEarningDateRadioGroupBox>
        </FilterContainerComponent>
    )
})