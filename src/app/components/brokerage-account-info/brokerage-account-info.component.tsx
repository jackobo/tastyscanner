import React from "react";
import {observer} from "mobx-react";
import {useServices} from "../../hooks/use-services.hook";
import styled from "styled-components";
import {IonSpinnerComponent} from "../../../framework/components/spinner/ion-spinner.component";

const ContainerBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--ion-space-16);
    width: 100%;
    padding: var(--ion-space-16);
`

const SpinnerContainerBox = styled(ContainerBox)`
    min-height: 100%;
    justify-content: center;
    align-items: center;
    justify-items: center;
`

const InfoFieldBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--ion-space-8);
    width: 100%;
`

const InfoFieldComponent: React.FC<{label: string, value: string}> = observer((props) => {
    return (
        <InfoFieldBox>
            <div>{props.label}</div>
            <div>{props.value}</div>
        </InfoFieldBox>
    )
})

export const BrokerageAccountInfoComponent: React.FC = observer(() => {
    const services = useServices();
    const accountInfo = services.brokers.currentAccount?.accountInfo;

    if(services.brokers.accountsLoadingInProgress) {
        return (
            <SpinnerContainerBox>
                <IonSpinnerComponent fillContainer={true}/>
            </SpinnerContainerBox>
        )
    }

    if(!accountInfo) {
        return null;
    }
    return (
        <ContainerBox>

            <InfoFieldComponent label={services.language.translate('Net liquidity')}
                                value={accountInfo.netLiquidity.toLocaleString()}/>
            <InfoFieldComponent label={services.language.translate('Options buying power')}
                                value={accountInfo.optionsBuyingPower.toLocaleString()}/>
            <InfoFieldComponent label={services.language.translate('Stocks buying power')}
                                value={accountInfo.stocksBuyingPower.toLocaleString()}/>
            <InfoFieldComponent label={services.language.translate('Cash balance')}
                                value={accountInfo.cashBalance.toLocaleString()}/>

        </ContainerBox>
    )
})
