import {observer} from "mobx-react";
import {StandardDialogPageComponent} from "../modal/page/standard-dialog-page.component";
import {StandardDialogHeaderComponent} from "../modal/header/standard-dialog-header.component";
import {StandardDialogContentComponent} from "../modal/content/standard-dialog-content.component";
import React from "react";
import {IDialogHandler} from "../../services/dialog/dialog.service.interface";
import {useFrameworkServices} from "../../hooks/use-framework-services.hook";
import {
    IAuthenticationMethodViewModel
} from "../../services/user/authentication-method/authentication-method.view-model.interface";
import styled from "styled-components";

const DialogContentContainerBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: var(--ion-space-16) 0;
    gap: var(--ion-space-24);
`

interface LoginFormComponentProps {
    dialogHandler: IDialogHandler;
    authenticationMethods: IAuthenticationMethodViewModel[];
    onAuthenticate: (method: IAuthenticationMethodViewModel) => Promise<void>;
}

export const LoginFormComponent: React.FC<LoginFormComponentProps> = observer((props) => {
    const services = useFrameworkServices();

    const renderAuthenticationMethod = (method: IAuthenticationMethodViewModel) => {
        return (
            <React.Fragment key={method.id}>
                {method.renderUI({onAuthenticate: () => props.onAuthenticate(method)})}
            </React.Fragment>
        )
    }

    return (
        <StandardDialogPageComponent>
            <StandardDialogHeaderComponent dialogHandler={props.dialogHandler}
                                           title={services.language.translate('Login')} renderTitleOnTheFirstRow={true}/>
            <StandardDialogContentComponent dialogHandler={props.dialogHandler}>
                <DialogContentContainerBox>
                    {props.authenticationMethods.map(renderAuthenticationMethod)}
                    <div>
                        Facebook
                    </div>
                </DialogContentContainerBox>

            </StandardDialogContentComponent>
        </StandardDialogPageComponent>
    )
})