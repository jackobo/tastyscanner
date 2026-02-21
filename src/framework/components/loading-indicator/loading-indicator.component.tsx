import React from "react";
import {observer} from "mobx-react";
import styled from "styled-components";

import {LOADING_INDICATOR_CONTAINER_ELEMENT_ID} from "../../services/loading-indicator/loading-indicator.service.interface";
import {ZIndex} from "../../types/z-index";
import {SpinnerComponent} from "../spinner/spinner.component";
import {Check} from "../../utils/type-checking";
import {useFrameworkServices} from "../../hooks/use-framework-services.hook";


const LoadingIndicatorBox = styled.div<{ $shouldDisplay: boolean }>`
  position: fixed;
  display: ${(props) => (props.$shouldDisplay ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(var(--ion-color-light-rgb), 0.7);
  color: var(--ion-color-dark);
  z-index: ${ZIndex.LoadingIndicator};
`

export const LoadingIndicatorComponent: React.FC = observer(() => {
    const services = useFrameworkServices();
    const indicator = services.loadingIndicator.current;


    return (
        <LoadingIndicatorBox key={LOADING_INDICATOR_CONTAINER_ELEMENT_ID}
                             id={LOADING_INDICATOR_CONTAINER_ELEMENT_ID}
                             $shouldDisplay={!Check.isNullOrUndefined(indicator)}>
            <SpinnerComponent />


        </LoadingIndicatorBox>
    )
});
