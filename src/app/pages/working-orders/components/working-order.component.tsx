import React from "react";
import {observer} from "mobx-react";
import {IWorkingOrderViewModel} from "../../../services/brokers/interfaces/working-order.interfaces";
import styled, {css} from "styled-components";
import {CardBox} from "../../../../framework/components/card/card.box";
import {WorkingOrderHeaderComponent} from "./working-order-header.component";
import {WorkingOrderLegsComponent} from "./working-order-legs.component";
import {WokingOrderFooterComponent} from "./working-order-footer.component";
import {WokingOrderBodyComponent} from "./working-order-body.component";

const WorkingOrderBox = styled(CardBox)<{$isReadOnly: boolean}>`
    display: flex;
    flex-direction: column;
    gap: var(--ion-space-12);
    font-size: var(--ion-font-size-body2);
    ${props => props.$isReadOnly 
            ? css`
                box-shadow: none;
                border: none;
                padding: 0;
                align-items: center;
                width: 100%;
                font-size: var(--ion-font-size-caption);
            `
            : css``
    }
`
interface WorkingOrderComponentProps {
    workingOrder: IWorkingOrderViewModel;
    isReadOnly?: boolean;
}
export const WorkingOrderComponent: React.FC<WorkingOrderComponentProps> = observer((props) => {

    const renderFooter = () => {
        if(props.isReadOnly || !props.workingOrder.autoReplaceEnabled) {
            return null;
        }

        return (
            <WokingOrderFooterComponent workingOrder={props.workingOrder}/>
        )
    }

    return (
        <WorkingOrderBox $isReadOnly={Boolean(props.isReadOnly)}>
            <WorkingOrderHeaderComponent workingOrder={props.workingOrder} isReadOnly={props.isReadOnly}/>
            <WokingOrderBodyComponent workingOrder={props.workingOrder} isReadOnly={props.isReadOnly}/>
            <WorkingOrderLegsComponent workingOrder={props.workingOrder}/>
            {renderFooter()}
        </WorkingOrderBox>
    )
})