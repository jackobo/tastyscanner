import React from "react";
import {observer} from "mobx-react";
import {IonSpinner} from "@ionic/react";
import styled from "styled-components";
import {FullContainerBox} from "../full-container-box/full-container.box";


const SpinnerBox = styled(IonSpinner)`
    width: 20px;
    height: 20px;
    --color: var(--ion-color-dark);
`

export const IonSpinnerComponent: React.FC<{className?: string; fillContainer?: boolean}> = observer((props) => {
    if(props.fillContainer) return (
        <FullContainerBox>
            <SpinnerBox name="circles"/>
        </FullContainerBox>
    )
    return (
        <SpinnerBox name="circles" className={props.className}/>
    )
})