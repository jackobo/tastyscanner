import styled from "styled-components";
import React from "react";
import {observer} from "mobx-react";
import {IonIcon} from "@ionic/react";
import {arrowForwardOutline} from "ionicons/icons";

const ArrowBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    cursor: pointer;
`



export const ArrowComponent: React.FC<{onClick: () => void}> = observer((props) => {
    return (
        <ArrowBox onClick={props.onClick}>
            <IonIcon icon={arrowForwardOutline}/>
        </ArrowBox>
    );
})