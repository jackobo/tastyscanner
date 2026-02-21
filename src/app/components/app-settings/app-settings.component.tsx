import React from "react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {useServices} from "../../hooks/use-services.hook";
import {
    StringFieldEditorComponent
} from "../../../framework/components/forms/string-field/string-field-editor.component";
import {PrimaryButton} from "../../../framework/components/buttons/primary-button";
import {PrimaryButtonInverted} from "../../../framework/components/buttons/primary-button-inverted";

const ContainerBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--ion-space-24);
    width: 100%;
    padding: var(--ion-space-16);
`

const ButtonsContainerBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
`

export const AppSettingsComponent: React.FC = observer(() => {
    const services = useServices();
    const fields = services.appSettings.fields;
    const onSave = () => {
        services.appSettings.save();
    }

    const onCancel = () => {
        services.appSettings.discardChanges();
    }

    return (
        <ContainerBox>
            <StringFieldEditorComponent field={fields.tastyRefreshToken}/>
            <StringFieldEditorComponent field={fields.tastyClientSecret}/>
            <ButtonsContainerBox>
                <PrimaryButton onClick={onSave} disabled={!services.appSettings.hasChanges}>
                    {services.language.translate("Save changes")}
                </PrimaryButton>

                <PrimaryButtonInverted onClick={onCancel} disabled={!services.appSettings.hasChanges}>
                    {services.language.translate("Discard changes")}
                </PrimaryButtonInverted>
            </ButtonsContainerBox>

        </ContainerBox>
    );
})