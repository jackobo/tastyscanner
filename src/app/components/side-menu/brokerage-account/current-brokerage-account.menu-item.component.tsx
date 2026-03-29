import React from "react";
import {observer} from "mobx-react";
import {useServices} from "../../../hooks/use-services.hook";
import {BrokerageAccountDropDownComponent} from "../../brokerage-account/brokerage-account-drop-down.component";
import styled from "styled-components";
import {IonSpinnerComponent} from "../../../../framework/components/spinner/ion-spinner.component";


const ContainerBox = styled.div`
  
    padding: var(--ion-space-8) var(--ion-space-12);
    
`

const SpinnerContainerBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: var(--ion-space-8);
    width: 100%;
    min-height: 80px;
`

export const CurrentBrokerageAccountMenuItemComponent: React.FC = observer(() => {
    const services = useServices();
    const brokersService = services.brokers;

    const renderSpinner = () => {
        return (
            <SpinnerContainerBox>
                <IonSpinnerComponent/>
                <span>{services.language.translate('Loading accounts...')}</span>
            </SpinnerContainerBox>

        )
    }

    const renderDropDown = () => {
        return (
            <BrokerageAccountDropDownComponent field={brokersService.fields.lastUsedAccountId}/>
        )
    }

    const renderContent = () => {
        if(brokersService.accountsLoadingInProgress) {
            return renderSpinner();
        } else {
            return renderDropDown();
        }
    }

    return (
        <ContainerBox>
            {renderContent()}
        </ContainerBox>
    )

})