import React from "react";
import {observer} from "mobx-react";
import {TastyScannerStandardPage} from "../tasty-scanner-standard.page";
import {useServices} from "../../hooks/use-services.hook";
import {
    IAccountOpenOrderLegViewModel,
    IAccountOpenOrderViewModel
} from "../../services/brokers/interfaces/account-open-order-interface";
import styled from "styled-components";
import {Check} from "../../../framework/utils/type-checking";
import {SpinnerComponent} from "../../../framework/components/spinner/spinner.component";
import {IonAccordion, IonAccordionGroup, IonItem} from "@ionic/react";

const LEG_INFO_CELL_WIDTH = '210px';

const PageContentBox = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    font-size: var(--ion-font-size-body2);
    gap: var(--ion-space-8);
`


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
    padding-left: var(--ion-space-24);
    padding-bottom: var(--ion-space-20);
`

const HeaderGridBox = styled.div`
    display: grid;
    grid-template-columns: calc(${LEG_INFO_CELL_WIDTH} + var(--ion-space-24)) 1fr 1fr;
    align-items: center;
`


const BodyGridBox = styled.div`
    display: grid;
    grid-template-columns: ${LEG_INFO_CELL_WIDTH} 1fr 1fr;
    align-items: center;
`

const GridCellBox = styled.div`
    padding: var(--ion-space-8);
`

const GridBodyCellBox = styled(GridCellBox)`
    border-bottom: 1px solid var(--ion-color-border);
`

const GridHeaderCellBox = styled(GridCellBox)`
    font-weight: var(--ion-font-weight-bold);
`

const RightBodyGridCellBox = styled(GridBodyCellBox)`
    text-align: right;
`

const CenteredBodyGridCellBox = styled(GridBodyCellBox)`
    text-align: center;
`

const RightHeaderGridCellBox = styled(GridHeaderCellBox)`
    text-align: right;
`

const CenteredHeaderGridCellBox = styled(GridHeaderCellBox)`
    text-align: center;
`



const LegInfoHeaderGridBox = styled(GridHeaderCellBox)`
`

const LegInfoBodyGridBox = styled(GridBodyCellBox)`
    display: grid;
    grid-template-columns: 25px auto 10px auto auto auto auto;
    flex-direction: row;
    align-items: center;
    justify-items: center;
    justify-content: space-evenly;
    gap: var(--ion-space-8);
    background-color: var(--ion-color-light);
    color: var(--ion-color-light-contrast);
    
`

const LegInfoGridCellBox = styled.div`
    width: 100%;
    text-align: center;
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
            <LegInfoBodyGridBox>
                <LegInfoGridCellBox>{props.leg.quantity}</LegInfoGridCellBox>
                <LegInfoSeparatorBox/>
                <LegInfoGridCellBox>{props.leg.optionType}</LegInfoGridCellBox>
                <LegInfoSeparatorBox/>
                <LegInfoGridCellBox>{services.time.formatUserFriendlyMonthDay(props.leg.expirationDate)}</LegInfoGridCellBox>
                <LegInfoSeparatorBox/>
                <LegInfoGridCellBox>{props.leg.strikePrice}</LegInfoGridCellBox>
            </LegInfoBodyGridBox>

            <RightBodyGridCellBox>{props.leg.price}</RightBodyGridCellBox>
            <CenteredBodyGridCellBox>{props.leg.daysToExpiration}</CenteredBodyGridCellBox>
        </>
    )
})


const OrderHeaderComponent: React.FC<{order: IAccountOpenOrderViewModel}> = observer(props => {

    const daysToExpiration =  props.order.legs.filter(l => !Check.isNullOrUndefined(l.daysToExpiration))
                                                      .map(l => l.daysToExpiration ?? 0);

    return (
        <>
            <GridBodyCellBox>
                {`Order id: ${props.order.id}`}
            </GridBodyCellBox>
            <RightBodyGridCellBox>
                {props.order.tradingPrice}
            </RightBodyGridCellBox>
            <CenteredBodyGridCellBox>
                {daysToExpiration.length > 0 ? Math.min(...daysToExpiration) : null}
            </CenteredBodyGridCellBox>
        </>

    )
})

const OrderComponent: React.FC<{order: IAccountOpenOrderViewModel}> = observer(props => {
    const legs = [...props.order.legs].sort((l1, l2) => (l1.strikePrice ?? 0) - (l2.strikePrice ?? 0));
    return (
        <BodyGridBox>
            <OrderHeaderComponent order={props.order}/>
            {legs.map((leg) => (<OrderLegComponent key={leg.symbol} leg={leg}/>))}
        </BodyGridBox>
    )
})

const UnderlyingSymbolOpenOrdersComponent: React.FC<{underlyingSymbol: string, openOrders: IAccountOpenOrderViewModel[]}> = observer((props) => {
    return (
        <IonAccordion value={props.underlyingSymbol}>
            <SymbolBox slot={"header"}>{props.underlyingSymbol}</SymbolBox>
            <OrdersBox slot="content">
                {props.openOrders.map(o => <OrderComponent key={o.id} order={o}/>)}
            </OrdersBox>
        </IonAccordion>

    )
})

const HeaderComponent: React.FC = observer(() => {
    return (
        <HeaderGridBox>
            <LegInfoHeaderGridBox>Symbol</LegInfoHeaderGridBox>
            <RightHeaderGridCellBox>Trd Prc</RightHeaderGridCellBox>
            <CenteredHeaderGridCellBox>DTE</CenteredHeaderGridCellBox>
        </HeaderGridBox>
    )
})

export const OpenPositionsPage: React.FC = observer(() => {

    const services = useServices();

    const openOrders = services.brokers.currentAccount?.openOrders;

    if(!openOrders || openOrders.isLoading) {
        return (
            <SpinnerComponent fillContainer={true}/>
        )
    }


    const ordersByUnderlying = openOrders.orders.groupByKey(o => o.underlyingSymbol);

    return (
        <TastyScannerStandardPage>

            <PageContentBox>
                <HeaderComponent/>
                <IonAccordionGroup>
                    {Object.keys(ordersByUnderlying).map(underlyingSymbol => (<UnderlyingSymbolOpenOrdersComponent key={underlyingSymbol} underlyingSymbol={underlyingSymbol} openOrders={ordersByUnderlying[underlyingSymbol]}/>))}
                </IonAccordionGroup>
            </PageContentBox>

        </TastyScannerStandardPage>
    )
})