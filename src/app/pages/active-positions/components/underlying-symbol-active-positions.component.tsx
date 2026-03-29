import React from "react";
import {
    IActivePositionViewModel
} from "../../../services/brokers/interfaces/active-position.interfaces";
import {observer} from "mobx-react";
import {IonAccordion, IonItem} from "@ionic/react";
import styled from "styled-components";
import {ActiveOrderHeaderComponent} from "./active-order-header.component";
import {ActiveOrderDetailsComponent} from "./active-order-details.component";

const SymbolBox = styled(IonItem)`
    cursor: pointer;
    font-weight: var(--ion-font-weight-bold);
    --background: var(--ion-color-light);
    --color: var(--ion-color-light-contrast);
    
`

const OrdersBox = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
`

const LeftPanelBox = styled.div`
    display: flex;
    flex-direction: column;
`

const RightPanelBox = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`

export const UnderlyingSymbolActivePositionsComponent: React.FC<{underlyingSymbol: string, openOrders: IActivePositionViewModel[]}> = observer((props) => {
    const orders = props.openOrders.sort((o1, o2) => (o1.daysToExpiration ?? 0) - (o2.daysToExpiration ?? 0));
    return (
        <IonAccordion value={props.underlyingSymbol}>
            <SymbolBox slot={"header"}>{props.underlyingSymbol}</SymbolBox>
            <OrdersBox slot="content">
                <LeftPanelBox>
                    {orders.map(o => <ActiveOrderHeaderComponent key={o.id} order={o}/>)}
                </LeftPanelBox>
                <RightPanelBox>
                    {orders.map(o => <ActiveOrderDetailsComponent key={o.id} order={o}/>)}
                </RightPanelBox>
            </OrdersBox>
        </IonAccordion>
    );
})
