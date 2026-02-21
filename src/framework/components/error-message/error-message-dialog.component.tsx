import React from 'react';
import {observer} from "mobx-react-lite";
import {StandardDialogPageComponent} from "../modal/page/standard-dialog-page.component";
import {StandardDialogHeaderComponent} from "../modal/header/standard-dialog-header.component";
import {
    StandardDialogContentComponent
} from "../modal/content/standard-dialog-content.component";
import {StandardDialogFooterComponent} from "../modal/footer/standard-dialog-footer.component";
import styled from "styled-components";
import {IDialogHandler} from "../../services/dialog/dialog.service.interface";
import {ContinueButtonComponent} from "../continue-button/continue-button.component";
import {IonIcon} from "@ionic/react";
import {alertCircleOutline} from "ionicons/icons";

const DialogContentContainerBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    flex-grow: 1;
    font-size: var(--ion-font-size-h5);
    font-weight: bold;
    gap: 3rem;
`

const ExclamationIconBox = styled.div`
    font-size: 48px;
    color: var(--ion-color-danger)
`

interface ErrorMessageDialogComponentProps {
    message: string;
    dialogHandler: IDialogHandler;
    details?: string;
}

export const ErrorMessageDialogComponent: React.FC<ErrorMessageDialogComponentProps> = observer((props) => {

    const renderDetails = () => {
        if(!props.details) {
            return null;
        }

        return (
            <div>
                {props.details}
            </div>
        )

    }
    return (
        <StandardDialogPageComponent>
            <StandardDialogHeaderComponent dialogHandler={props.dialogHandler}/>
            <StandardDialogContentComponent dialogHandler={props.dialogHandler} fullContentHeight={true}>
                <DialogContentContainerBox>
                    <ExclamationIconBox>
                        <IonIcon icon={alertCircleOutline}/>
                    </ExclamationIconBox>
                    <div>
                        {props.message}
                    </div>
                    {renderDetails()}
                </DialogContentContainerBox>

            </StandardDialogContentComponent>
            <StandardDialogFooterComponent dialogHandler={props.dialogHandler}>
                <ContinueButtonComponent onClick={() => props.dialogHandler.accept()} fullWidth={true}/>
            </StandardDialogFooterComponent>
        </StandardDialogPageComponent>
    )
})
