import React from "react";
import {observer} from "mobx-react";
import {StandardDialogPageComponent} from "../../../framework/components/modal/page/standard-dialog-page.component";
import {
    StandardDialogHeaderComponent
} from "../../../framework/components/modal/header/standard-dialog-header.component";
import {IDialogHandler} from "../../../framework/services/dialog/dialog.service.interface";
import {useServices} from "../../hooks/use-services.hook";
import {
    StandardDialogContentComponent
} from "../../../framework/components/modal/content/standard-dialog-content.component";
import {AppSettingsComponent} from "./app-settings.component";

interface AppSettingsDialogComponentProps {
    dialogHandler: IDialogHandler;
}
export const AppSettingsDialogComponent: React.FC<AppSettingsDialogComponentProps> = observer((props) => {
    const services = useServices();

    const onSave = () => {
        props.dialogHandler.accept();
    }

    return (
        <StandardDialogPageComponent>
            <StandardDialogHeaderComponent dialogHandler={props.dialogHandler} title={services.language.translate('Application settings')}/>
            <StandardDialogContentComponent dialogHandler={props.dialogHandler}>
                <AppSettingsComponent onSave={onSave}/>
            </StandardDialogContentComponent>
        </StandardDialogPageComponent>
    )
})