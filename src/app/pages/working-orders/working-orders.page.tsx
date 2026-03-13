import React from "react";
import {observer} from "mobx-react";
import {TastyScannerStandardPage} from "../tasty-scanner-standard.page";
import {useServices} from "../../hooks/use-services.hook";
import {IWorkingOrderViewModel} from "../../services/brokers/interfaces/working-order.interfaces";
import styled from "styled-components";
import {CardBox} from "../../../framework/components/card/card.box";

const PageContentBox = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--ion-space-24);
    width: 100%;
`

const WorkingOrderBox = styled(CardBox)`
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: var(--ion-space-16);
    row-gap: var(--ion-space-8);
`

const WorkingOrderComponent: React.FC<{workingOrder: IWorkingOrderViewModel}> = observer((props) => {
    const services = useServices();
    return (
        <WorkingOrderBox>
            <div>{services.language.translate('Order id:')}</div>
            <div>{props.workingOrder.id}</div>
            <div>{services.language.translate('Trading price:')}</div>
            <div>{props.workingOrder.tradingPrice}</div>
        </WorkingOrderBox>
    )
})

export const WorkingOrdersPage: React.FC = observer(() => {
    const services = useServices();

    const workingOrders = services.brokers.currentAccount?.workingOrders ?? [];

    const renderOneWorkingOrder = (wo: IWorkingOrderViewModel) => {
        return (<WorkingOrderComponent key={wo.id} workingOrder={wo}/>);
    }

    return (
        <TastyScannerStandardPage>
            <PageContentBox>
                {workingOrders.map(renderOneWorkingOrder)}
            </PageContentBox>
        </TastyScannerStandardPage>
    )
})