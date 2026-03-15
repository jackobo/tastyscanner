import React from "react";
import {observer} from "mobx-react";
import {IWorkingOrderViewModel} from "../../../services/brokers/interfaces/working-order.interfaces";
import styled from "styled-components";
import {WorkingOrderComponent} from "./working-order.component";

const ToastContainerBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--ion-space-12);
    width: 100%;
`

const HeaderBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--ion-space-8);
`

const TitleBox = styled.div<{$color: string}>`
    flex-grow: 1;
    color: ${props => props.$color};
`

export type OrderUpdateType = 'Sent' | 'Replaced' | 'Live' | 'Canceled' | 'Filled' | 'Rejected';

export const WorkingOrderConfirmationToastComponent: React.FC<{workingOrder: IWorkingOrderViewModel; orderUpdateType: OrderUpdateType}> = observer((props) => {

    let titleColor: string;
    switch (props.orderUpdateType) {
        case 'Filled':
            titleColor = 'var(--ion-color-success-shade)';
            break;
        case 'Canceled':
            titleColor = 'var(--ion-color-warning-shade)';
            break;
        case 'Rejected':
            titleColor = 'var(--ion-color-danger-shade)';
            break;
        default:
            titleColor = 'var(--ion-color-primary-shade)';
    }

    return (
        <ToastContainerBox>
            <HeaderBox>
                <TitleBox $color={titleColor}>
                    {props.orderUpdateType}
                </TitleBox>
            </HeaderBox>
            <WorkingOrderComponent workingOrder={props.workingOrder} isReadOnly={true}/>
        </ToastContainerBox>
    )
})