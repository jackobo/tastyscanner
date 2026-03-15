import React from "react";
import {observer} from "mobx-react";
import {
    IWorkingOrderLegViewModel,
    IWorkingOrderViewModel
} from "../../../services/brokers/interfaces/working-order.interfaces";
import styled from "styled-components";
import {useServices} from "../../../hooks/use-services.hook";

const LegsContainerBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
    font-size: var(--ion-font-size-body2);
`

const LegContainerBox = styled.div<{$isSell: boolean}>`
    display: grid;
    grid-template-columns: 20px 50px 35px 50px 10px 35px;
    border-radius: var(--ion-border-radius);
    gap: var(--ion-space-8);
    align-items: center;
    justify-content: center;
    justify-items: center;
    padding: var(--ion-space-8);
    background-color: ${props => props.$isSell ? 'var(--ion-color-danger)' : 'var(--ion-color-success)'};
    color: ${props => props.$isSell ? 'var(--ion-color-danger-contrast)' : 'var(--ion-color-success-contrast)'};
`



const WorkingOrderLegComponent: React.FC<{leg: IWorkingOrderLegViewModel}> = observer((props) => {
    const services = useServices();
    return (
        <LegContainerBox $isSell={props.leg.isSell}>
            <div>{props.leg.quantity}</div>
            <div>{services.time.formatUserFriendlyMonthDay(props.leg.expirationDate)}</div>
            <div>{props.leg.daysToExpiration ? `${props.leg.daysToExpiration}d` : ''}</div>
            <div>{props.leg.strikePrice}</div>
            <div>{props.leg.optionType}</div>
            <div>{props.leg.actionType}</div>
        </LegContainerBox>
    );
})

export const WorkingOrderLegsComponent: React.FC<{workingOrder: IWorkingOrderViewModel}> = observer((props) => {
    const legs = [...props.workingOrder.legs]
        .sort((a, b) => {
            const expirationComparison = (a.expirationDate?.getTime() ?? 0) - (b.expirationDate?.getTime() ?? 0);
            if(expirationComparison !== 0) {
                return expirationComparison;
            }
            return (a.strikePrice ?? 0) - (b.strikePrice ?? 0);
        })
    return (
        <LegsContainerBox>
            {legs.map((leg) => (
                <WorkingOrderLegComponent key={leg.key} leg={leg} />
            ))}
        </LegsContainerBox>
    )
})