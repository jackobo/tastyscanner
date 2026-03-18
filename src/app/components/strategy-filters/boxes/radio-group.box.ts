import styled from "styled-components";
import {IonRadioGroup} from "@ionic/react";

export const RadioGroupBox = styled(IonRadioGroup)`
    padding-bottom: var(--ion-space-12);
    padding-top: var(--ion-space-12);
    width: 100%;
    
    & .radio-group-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        gap: var(--ion-space-8);
        width: 100%;
    }
    
`
