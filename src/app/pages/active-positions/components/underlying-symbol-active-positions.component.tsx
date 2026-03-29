import React from "react";
import {
    IActivePositionLegViewModel,
    IActivePositionViewModel
} from "../../../services/brokers/interfaces/active-position.interfaces";
import {observer} from "mobx-react";
import {IonAccordion, IonItem} from "@ionic/react";
import {
    BodyGridBox,
    CenterAlignedBodyGridCellBox,
    GridBodyCellBox, LegInfoBodyGridCellBox, LegInfoGridCellBox,
    RightAlignedBodyGridCellBox
} from "../boxes/grid-body.boxes";
import {useServices} from "../../../hooks/use-services.hook";
import styled, {css} from "styled-components";

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
    padding-bottom: var(--ion-space-20);
`


const LegInfoSeparatorBox = styled.span<{$isSell: boolean}>`
    display: flex;
    height: 70%;
    border-right: 1px solid var(--ion-color-dark);
    ${props => props.$isSell
            ? css`
                border-right: 1px solid var(--ion-color-danger-contrast);
            `
            : css`
                border-right: 1px solid var(--ion-color-success-contrast);
            `
    }
    
`

const OrderLegComponent: React.FC<{leg: IActivePositionLegViewModel}> = observer((props) => {
    const services = useServices();
    return (
        <>
            <LegInfoBodyGridCellBox $isSell={props.leg.isSell}>
                <LegInfoGridCellBox>-10</LegInfoGridCellBox>
                <LegInfoSeparatorBox $isSell={props.leg.isSell}/>
                <LegInfoGridCellBox>{props.leg.optionType}</LegInfoGridCellBox>
                <LegInfoSeparatorBox $isSell={props.leg.isSell}/>
                <LegInfoGridCellBox>{services.time.formatUserFriendlyMonthDay(props.leg.expirationDate)}</LegInfoGridCellBox>
                <LegInfoSeparatorBox $isSell={props.leg.isSell}/>
                <LegInfoGridCellBox>{props.leg.strikePrice}</LegInfoGridCellBox>
            </LegInfoBodyGridCellBox>


            <CenterAlignedBodyGridCellBox>{props.leg.daysToExpiration}</CenterAlignedBodyGridCellBox>
            <RightAlignedBodyGridCellBox>{`${props.leg.profitLossPercent.toFixed(2)}%`}</RightAlignedBodyGridCellBox>
            <RightAlignedBodyGridCellBox>{props.leg.profitLoss.toFixed(2)}</RightAlignedBodyGridCellBox>
            <RightAlignedBodyGridCellBox>{props.leg.marketPrice.toFixed(2)}</RightAlignedBodyGridCellBox>
            <RightAlignedBodyGridCellBox>{props.leg.tradingPrice.toFixed(2)}</RightAlignedBodyGridCellBox>
            <RightAlignedBodyGridCellBox>{props.leg.bidPrice?.toFixed(2)}</RightAlignedBodyGridCellBox>
            <RightAlignedBodyGridCellBox>{props.leg.askPrice?.toFixed(2)}</RightAlignedBodyGridCellBox>
            <RightAlignedBodyGridCellBox/>
        </>
    )
})

const OrderDetailsComponent: React.FC<{order: IActivePositionViewModel}> = observer(props => {
    return (
        <>
            <GridBodyCellBox>
                {`Order id: ${props.order.id}`}
            </GridBodyCellBox>

            <CenterAlignedBodyGridCellBox>
                {props.order.daysToExpiration}
            </CenterAlignedBodyGridCellBox>

            <RightAlignedBodyGridCellBox>
                {`${props.order.profitLossPercent.toFixed(2)}%`}
            </RightAlignedBodyGridCellBox>

            <RightAlignedBodyGridCellBox>
                {props.order.profitLoss.toFixed(2)}
            </RightAlignedBodyGridCellBox>


            <RightAlignedBodyGridCellBox>
                {props.order.marketPrice.toFixed(2)}
            </RightAlignedBodyGridCellBox>

            <RightAlignedBodyGridCellBox>
                {props.order.tradingPrice.toFixed(2)}
            </RightAlignedBodyGridCellBox>

            <RightAlignedBodyGridCellBox>

            </RightAlignedBodyGridCellBox>
            <RightAlignedBodyGridCellBox>
            </RightAlignedBodyGridCellBox>
            <RightAlignedBodyGridCellBox>
            </RightAlignedBodyGridCellBox>
        </>

    )
})


const OrderComponent: React.FC<{order: IActivePositionViewModel}> = observer(props => {
    const legs = props.order.legs;
    return (
        <BodyGridBox>
            <OrderDetailsComponent order={props.order}/>
            {legs.map((leg) => (<OrderLegComponent key={leg.symbol} leg={leg}/>))}
        </BodyGridBox>
    )
})


export const UnderlyingSymbolActivePositionsComponent: React.FC<{underlyingSymbol: string, openOrders: IActivePositionViewModel[]}> = observer((props) => {
    const orders = props.openOrders.sort((o1, o2) => (o1.daysToExpiration ?? 0) - (o2.daysToExpiration ?? 0));
    return (
        <IonAccordion value={props.underlyingSymbol}>
            <SymbolBox slot={"header"}>{props.underlyingSymbol}</SymbolBox>
            <OrdersBox slot="content">
                {orders.map(o => <OrderComponent key={o.id} order={o}/>)}
            </OrdersBox>
        </IonAccordion>
    );
})
