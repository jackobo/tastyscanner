import React from "react";
import {observer} from "mobx-react";
import {IWorkingOrderViewModel} from "../../../services/brokers/interfaces/working-order.interfaces";
import styled from "styled-components";
import {CardBox} from "../../../../framework/components/card/card.box";
import {WorkingOrderHeaderComponent} from "./working-order-header.component";
import {WorkingOrderLegsComponent} from "./working-order-legs.component";
import {WokingOrderFooterComponent} from "./working-order-footer.component";
import {WokingOrderBodyComponent} from "./working-order-body.component";

const WorkingOrderBox = styled(CardBox)`
    display: flex;
    flex-direction: column;
    gap: var(--ion-space-12);
`

export const WorkingOrderComponent: React.FC<{workingOrder: IWorkingOrderViewModel}> = observer((props) => {

    return (
        <WorkingOrderBox>

            <WorkingOrderHeaderComponent workingOrder={props.workingOrder}/>
            <WokingOrderBodyComponent workingOrder={props.workingOrder}/>
            <WorkingOrderLegsComponent workingOrder={props.workingOrder}/>

            <WokingOrderFooterComponent workingOrder={props.workingOrder}/>
        </WorkingOrderBox>
    )
})