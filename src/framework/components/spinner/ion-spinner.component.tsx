import React from "react";
import {observer} from "mobx-react";
import {IonSpinner} from "@ionic/react";
import styled from "styled-components";

const SpinnerBox = styled(IonSpinner)`
    width: 20px;
    height: 20px;
    --color: var(--ion-color-dark);
`

export const IonSpinnerComponent: React.FC<{className?: string;}> = observer((props) => {
    return (
        <SpinnerBox name="circles" className={props.className}/>
    )
})