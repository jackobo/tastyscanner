import React from "react";
import {observer} from "mobx-react";
import {IDialogHandler} from "../../services/dialog/dialog.service.interface";
import {IApiErrorToastHandlerViewModel} from "./api-error-toast-handler.-view-model.interface";
import {StandardDialogPageComponent} from "../modal/page/standard-dialog-page.component";
import {StandardDialogHeaderComponent} from "../modal/header/standard-dialog-header.component";
import {StandardDialogContentComponent} from "../modal/content/standard-dialog-content.component";
import {StandardDialogFooterComponent} from "../modal/footer/standard-dialog-footer.component";
import {ContinueButtonComponent} from "../continue-button/continue-button.component";
import {ApiErrorFieldComponent} from "./boxes/api-error.boxes";
import styled from "styled-components";
import {IonIcon} from "@ionic/react";
import {alertCircleOutline} from "ionicons/icons";
import {useFrameworkServices} from "../../hooks/use-framework-services.hook";

const ContainerBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--ion-space-16);
    width: 100%;
    font-size: var(--ion-font-size-h6);
    padding: var(--ion-space-16) var(--ion-space-24);
`

const DialogTitleBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--ion-space-8);
`

const ErrorDetailsBox = styled.div`
    white-space: pre-wrap;
`

const IconBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    color: var(--ion-color-danger);
    font-size: var(--ion-font-size-h1);
`

interface ApiErrorDetailsDialogComponentProps {
    dialogHandler: IDialogHandler;
    toastHandler: IApiErrorToastHandlerViewModel;
}
export const ApiErrorDetailsDialogComponent: React.FC<ApiErrorDetailsDialogComponentProps> = observer((props) => {
    const services = useFrameworkServices();

    const renderTitle = () => {
        return (
            <DialogTitleBox>
                <IconBox>
                    <IonIcon icon={alertCircleOutline}/>
                </IconBox>
                <span>
                    {services.language.translate("API error details")}
                </span>
            </DialogTitleBox>
        )
    }

    const renderErrorDetails = () => {
        return (
            <ErrorDetailsBox>
                {props.toastHandler.errorDetails || services.language.translate('No additional details available.')}
            </ErrorDetailsBox>
        );
    }

    return (
        <StandardDialogPageComponent>
            <StandardDialogHeaderComponent dialogHandler={props.dialogHandler}
                                           title={renderTitle()}/>
            <StandardDialogContentComponent dialogHandler={props.dialogHandler}>
                <ContainerBox>
                    <ApiErrorFieldComponent label={services.language.translate('Error code:')}
                                            value={props.toastHandler.errorCode}
                                            orientation={"horizontal"}/>
                    <ApiErrorFieldComponent label={services.language.translate('Description:')}
                                            value={props.toastHandler.errorDescription}/>

                    <ApiErrorFieldComponent label={services.language.translate('Endpoint:')} value={props.toastHandler.endpoint}/>

                    <ApiErrorFieldComponent label={services.language.translate('Details:')}
                                            value={renderErrorDetails()}/>
                </ContainerBox>
            </StandardDialogContentComponent>
            <StandardDialogFooterComponent dialogHandler={props.dialogHandler}>
                <ContinueButtonComponent onClick={() => props.dialogHandler.accept()} fullWidth={true}/>
            </StandardDialogFooterComponent>
        </StandardDialogPageComponent>
    )
})