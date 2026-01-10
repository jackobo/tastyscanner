import React from "react";
import {observer} from "mobx-react";
import {useServices} from "../hooks/use-services.hook";
import styled from "styled-components";

const AccountsBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 1rem;
    width: 100%;
    border-bottom: 1px solid var(--ion-color-light-shade);
    padding-bottom: 16px;
`

export const BrokerAccountsComponent: React.FC = observer(() => {
    const services = useServices();
    //const accounts = services.brokerAccount.accounts;
    return (
        <AccountsBox>
            {`Current account: ${services.brokerAccount.currentAccount?.accountNumber}`}
        </AccountsBox>
    )
})