import React from "react";
import {observer} from "mobx-react";
import {IonSpinner} from "@ionic/react";
import styled from "styled-components";
import {SpinnerFullSizeContainerBox} from "./spinner-full-size-container.box";


const SpinnerBox = styled(IonSpinner)`
    width: 20px;
    height: 20px;
    --color: var(--ion-color-dark);
`

export const IonSpinnerComponent: React.FC<{className?: string; fillContainer?: boolean}> = observer((props) => {
    if(props.fillContainer) return (
        <SpinnerFullSizeContainerBox>
            <SpinnerBox name="circles"/>
        </SpinnerFullSizeContainerBox>
    )
    return (
        <SpinnerBox name="circles" className={props.className}/>
    )
})