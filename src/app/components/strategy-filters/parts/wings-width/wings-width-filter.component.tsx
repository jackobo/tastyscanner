import React from "react";
import {observer} from "mobx-react";
import {IonRadio} from "@ionic/react";
import {IStrategyFiltersViewModel} from "../../../../services/strategy-settings/strategy-settings.service.interface";
import {FilterContainerComponent} from "../../common/filter-container/filter-container.component";
import {FilterLabelComponent} from "../../common/filter-label/filter-label.component";
import {RadioGroupBox} from "../../boxes/radio-group.box";
import {useServices} from "../../../../hooks/use-services.hook";



export const WingsWidthFilterComponent: React.FC<{filters: IStrategyFiltersViewModel}> = observer((props) => {
    const services = useServices();
    const filters = props.filters;
    return (
        <FilterContainerComponent>
            <FilterLabelComponent>
                {services.language.translate('Wings size')}
            </FilterLabelComponent>

            <RadioGroupBox value={filters.wings[0]}
                                   onIonChange={e => filters.wings = [e.detail.value]}>

                {filters.availableWings.map(wing => {
                    return (
                        <IonRadio value={wing} labelPlacement="stacked">
                            {wing.toString()}
                        </IonRadio>
                    )
                })}

            </RadioGroupBox>
        </FilterContainerComponent>
    )
})