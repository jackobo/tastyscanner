import React from "react";
import {observer} from "mobx-react";
import {IWorkingOrderViewModel} from "../../../services/brokers/interfaces/working-order.interfaces";
import {useServices} from "../../../hooks/use-services.hook";
import styled from "styled-components";
import {CardBox} from "../../../../framework/components/card/card.box";
import {WorkingOrderHeaderComponent} from "./working-order-header.component";

const WorkingOrderBox = styled(CardBox)`
    display: flex;
    flex-direction: column;
    gap: var(--ion-space-8);
    font-size: var(--ion-font-size-body2);
`


const WorkingOrderFieldsBox = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: var(--ion-space-16);
    row-gap: var(--ion-space-8);
`

export const WorkingOrderComponent: React.FC<{workingOrder: IWorkingOrderViewModel}> = observer((props) => {
    const services = useServices();

    return (
        <WorkingOrderBox>

            <WorkingOrderHeaderComponent workingOrder={props.workingOrder}/>
            <WorkingOrderFieldsBox>
                <div>{services.language.translate('Order id:')}</div>
                <div>{props.workingOrder.id}</div>
                <div>{services.language.translate('Underlying symbol:')}</div>
                <div>{props.workingOrder.underlyingSymbol}</div>
                <div>{services.language.translate('Trading price:')}</div>
                <div>{props.workingOrder.tradingPrice.toFixed(2)}</div>
                <div>{services.language.translate('Mid price:')}</div>
                <div>{props.workingOrder.midPrice?.toFixed(2)}</div>
            </WorkingOrderFieldsBox>

        </WorkingOrderBox>
    )
})