import React from "react";
import {
    IAccountOpenOrderLegViewModel,
    IAccountOpenOrderViewModel
} from "../../../services/brokers/interfaces/account-open-order-interface";
import {observer} from "mobx-react";
import {IonAccordion, IonItem} from "@ionic/react";
import {
    BodyGridBox,
    CenterAlignedBodyGridCellBox,
    GridBodyCellBox, LegInfoBodyGridCellBox, LegInfoGridCellBox,
    RightAlignedBodyGridCellBox
} from "../boxes/grid-body.boxes";
import {useServices} from "../../../hooks/use-services.hook";
import styled from "styled-components";
import {ORDERS_PADDING_LEFT} from "../boxes/constants";




const SymbolBox = styled(IonItem)`
    cursor: pointer;
    font-weight: var(--ion-font-weight-bold);
    --background: var(--ion-color-light);
    --color: var(--ion-color-light-contrast);
    
`

const OrdersBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--ion-space-8);
    padding-left: ${ORDERS_PADDING_LEFT};
    padding-bottom: var(--ion-space-20);
`


const LegInfoSeparatorBox = styled.span`
    display: flex;
    height: 70%;
    border-right: 1px solid var(--ion-color-dark);
`




const OrderLegComponent: React.FC<{leg: IAccountOpenOrderLegViewModel}> = observer((props) => {
    const services = useServices();
    return (
        <>
            <LegInfoBodyGridCellBox>
                <LegInfoGridCellBox>{props.leg.quantity}</LegInfoGridCellBox>
                <LegInfoSeparatorBox/>
                <LegInfoGridCellBox>{props.leg.optionType}</LegInfoGridCellBox>
                <LegInfoSeparatorBox/>
                <LegInfoGridCellBox>{services.time.formatUserFriendlyMonthDay(props.leg.expirationDate)}</LegInfoGridCellBox>
                <LegInfoSeparatorBox/>
                <LegInfoGridCellBox>{props.leg.strikePrice}</LegInfoGridCellBox>
            </LegInfoBodyGridCellBox>

            <CenterAlignedBodyGridCellBox>{props.leg.daysToExpiration}</CenterAlignedBodyGridCellBox>
            <RightAlignedBodyGridCellBox>{props.leg.tradingPrice.toFixed(2)}</RightAlignedBodyGridCellBox>
            <RightAlignedBodyGridCellBox>{props.leg.bidPrice?.toFixed(2)}</RightAlignedBodyGridCellBox>
            <RightAlignedBodyGridCellBox>{props.leg.askPrice?.toFixed(2)}</RightAlignedBodyGridCellBox>
        </>
    )
})

const OrderDetailsComponent: React.FC<{order: IAccountOpenOrderViewModel}> = observer(props => {
    return (
        <>
            <GridBodyCellBox>
                {`Order id: ${props.order.id}`}
            </GridBodyCellBox>

            <CenterAlignedBodyGridCellBox>
                {props.order.daysToExpiration}
            </CenterAlignedBodyGridCellBox>

            <RightAlignedBodyGridCellBox>
                {props.order.tradingPrice.toFixed(2)}
            </RightAlignedBodyGridCellBox>

            <RightAlignedBodyGridCellBox>

            </RightAlignedBodyGridCellBox>
            <RightAlignedBodyGridCellBox>

            </RightAlignedBodyGridCellBox>
        </>

    )
})


const OrderComponent: React.FC<{order: IAccountOpenOrderViewModel}> = observer(props => {
    const legs = props.order.legs;
    return (
        <BodyGridBox>
            <OrderDetailsComponent order={props.order}/>
            {legs.map((leg) => (<OrderLegComponent key={leg.symbol} leg={leg}/>))}
        </BodyGridBox>
    )
})


export const UnderlyingSymbolOpenOrdersComponent: React.FC<{underlyingSymbol: string, openOrders: IAccountOpenOrderViewModel[]}> = observer((props) => {
    const orders = props.openOrders.sort((o1, o2) => (o1.daysToExpiration ?? 0) - (o2.daysToExpiration ?? 0));
    return (
        <IonAccordion value={props.underlyingSymbol}>
            <SymbolBox slot={"header"}>{props.underlyingSymbol}</SymbolBox>
            <OrdersBox slot="content">
                {orders.map(o => <OrderComponent key={o.id} order={o}/>)}
            </OrdersBox>
        </IonAccordion>

    )
})
