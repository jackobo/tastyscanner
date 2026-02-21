import React from 'react';
import {observer} from "mobx-react-lite";
import {IDialogHandler} from "../../../services/dialog/dialog.service.interface";
import styled from "styled-components";
import {IonIcon} from "@ionic/react";
import {closeOutline} from "ionicons/icons";

const CloseButtonBox = styled.div<{$isHidden: boolean}>`
    visibility: ${props => props.$isHidden ? 'hidden' : 'visible'};
    cursor: pointer;
    font-size: 24px;
`

export type DialogCloseButtonVisibility = 'visible' | 'hidden' | 'not-render';

interface DialogCloseButtonComponentProps {
    dialogHandler: IDialogHandler;
    onClick?: () => void;
    visibility: DialogCloseButtonVisibility;
}
export const DialogCloseButtonComponent: React.FC<DialogCloseButtonComponentProps> = observer((props) => {

    if(props.visibility === 'not-render') {
        return null;
    }
    const onClickHandler = () => {
        if(props.onClick) {
            props.onClick();
        } else {
            props.dialogHandler.onXCloseButtonClick();
        }
    }

    return (
        <CloseButtonBox onClick={onClickHandler} $isHidden={props.visibility === 'hidden'}>
            <IonIcon icon={closeOutline}/>
        </CloseButtonBox>
    )
});
