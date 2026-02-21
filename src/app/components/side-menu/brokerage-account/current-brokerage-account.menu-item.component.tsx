import React from "react";
import {observer} from "mobx-react";
import {useServices} from "../../../hooks/use-services.hook";
import {
    StandardSideMenuItemComponent
} from "../../../../framework/components/side-menu/left/standard-side-menu-item.component";
import {BrokerageAccountDropDownComponent} from "./brokerage-account-drop-down.component";
import styled from "styled-components";

const ContainerBox = styled.div`
    padding-bottom: var(--ion-space-8);
    border-bottom: 1px solid var(--ion-color-border);
`

export const CurrentBrokerageAccountMenuItemComponent: React.FC = observer(() => {
    const services = useServices();
    const brokerageAccount = services.brokerageAccount;

    const renderDropDown = () => {
        return (
            <BrokerageAccountDropDownComponent field={brokerageAccount.fields.accountNumber}/>
        )
    }

    return (
        <ContainerBox>
            <StandardSideMenuItemComponent renderContent={renderDropDown} isSelected={() => false} />
        </ContainerBox>

    )
})