import React from "react";
import {observer} from "mobx-react";
import {FilterLabelBox} from "../../boxes/filter-label.box";
import {IonRadio} from "@ionic/react";
import styled from "styled-components";
import {IStrategyFiltersViewModel} from "../../../../services/strategy-settings/strategy-settings.service.interface";
import {RadioGroupBox} from "../../boxes/radio-group.box";

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
        <>
            <FilterLabelBox>
                Filter expirations by earnings date
            </FilterLabelBox>

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
        </>
    )
})