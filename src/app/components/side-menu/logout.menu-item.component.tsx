import React from "react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {NeutralButton} from "../../../framework/components/buttons/neutral-button";
import {useServices} from "../../hooks/use-services.hook";
import {logOutOutline} from "ionicons/icons";
import {IonIcon} from "@ionic/react";

const ButtonContainerBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    padding-top: var(--ion-space-16);
`

const LogoutButton = styled(NeutralButton)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-size: var(--ion-font-size-h6);
    font-weight: var(--ion-font-weight-regular);
`
const IconBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 22px;
`


export const LogoutMenuItemComponent: React.FC = observer(() => {
    const services = useServices();
    return (
        <ButtonContainerBox>
            <LogoutButton fullWidth={true}>
                <span>
                    {services.language.translate('Logout')}
                </span>
                <IconBox>
                    <IonIcon icon={logOutOutline}/>
                </IconBox>

            </LogoutButton>
        </ButtonContainerBox>
    )
})