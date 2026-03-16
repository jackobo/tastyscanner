import React from "react";
import {observer} from "mobx-react";
import {IonRadio} from "@ionic/react";
import styled from "styled-components";
import {IStrategyFiltersViewModel} from "../../../../services/strategy-settings/strategy-settings.service.interface";
import {RadioGroupBox} from "../../boxes/radio-group.box";
import {FilterContainerComponent} from "../../common/filter-container/filter-container.component";
import {FilterLabelComponent} from "../../common/filter-label/filter-label.component";

const LabelBox = styled(FilterLabelComponent)`
    padding-bottom: var(--ion-space-8);
`

const ByEarningDateRadioGroupBox = styled(RadioGroupBox)`
    & .radio-group-wrapper {
        flex-direction: column;
        align-items: flex-start;
        justify-content: unset;
        gap: 8px;
    }
`


export const ByEarningsDateFilterComponent: React.FC<{filters: IStrategyFiltersViewModel}> = observer((props) => {
    const filters = props.filters;
    return (
        <FilterContainerComponent hideBorder={true}>
            <LabelBox>
                Filter expirations by earnings date
            </LabelBox>

            <ByEarningDateRadioGroupBox value={filters.byEarningsDate}
                                        onIonChange={e => filters.byEarningsDate = e.detail.value}>
                <IonRadio value={"all"} labelPlacement="end">
                    No filter
                </IonRadio>

                <IonRadio value={"before"} labelPlacement="end">
                    Before earnings
                </IonRadio>

                <IonRadio value={"after"} labelPlacement="end">
                    After earnings
                </IonRadio>

            </ByEarningDateRadioGroupBox>
        </FilterContainerComponent>
    )
})