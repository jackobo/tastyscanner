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

interface LoginFormComponentProps {
    dialogHandler: IDialogHandler;
    authenticationMethods: IAuthenticationMethodViewModel[];
}

export const LoginFormComponent: React.FC<LoginFormComponentProps> = observer((props) => {
    const services = useFrameworkServices();

    const renderAuthenticationMethod = (method: IAuthenticationMethodViewModel) => {
        const onAuthenticate = async () =>  {
            await method.login();
            props.dialogHandler.accept(method);
        }
        return (
            <React.Fragment key={method.id}>
                {method.renderUI({onAuthenticate: onAuthenticate})}
            </React.Fragment>
        )
    }

    return (
        <StandardDialogPageComponent>
            <StandardDialogHeaderComponent dialogHandler={props.dialogHandler} title={services.language.translate('Login')}/>
            <StandardDialogContentComponent dialogHandler={props.dialogHandler}>
                {props.authenticationMethods.map(renderAuthenticationMethod)}
            </StandardDialogContentComponent>
        </StandardDialogPageComponent>
    )
})