import React from "react";
import styled from "styled-components";
import {IonIcon} from "@ionic/react";
import {chevronDown} from "ionicons/icons";


const DropDownChevronBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--ion-color-medium, #595959);
    font-size: inherit;
`


export const DropDownChevronComponent: React.FC = () => {
    return (
        <DropDownChevronBox>
            <IonIcon icon={chevronDown}/>
        </DropDownChevronBox>
    );
}
