import React, {useEffect} from "react";
import {observer} from "mobx-react";
import {TastyScannerStandardPage} from "../tasty-scanner-standard.page";
import {useServices} from "../../hooks/use-services.hook";
import {
    IAccountOpenOrderLegViewModel,
    IAccountOpenOrderViewModel
} from "../../services/brokers/interfaces/account-open-order-interface";
import styled from "styled-components";
import {Check} from "../../../framework/utils/type-checking";


const PageContentBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--ion-space-24);
`

const UnderlyingSymbolBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--ion-space-8);
    width: 100%;
`


const SymbolBox = styled.div`
    font-weight: var(--ion-font-weight-bold);
`

const OrdersBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--ion-space-8);
    padding-left: var(--ion-space-24);
`

const OrderBox = styled.div`
    display: grid;
    grid-template-columns: 210px 1fr 1fr;
    align-items: center;
`

const GridCellBox = styled.div`
    padding: var(--ion-space-8);
    border-bottom: 1px solid var(--ion-color-border);
`

const RightGridCellBox = styled(GridCellBox)`
    text-align: right;
`

const CenteredGridCellBox = styled(GridCellBox)`
    text-align: center;
`

const LegInfoGridBox = styled(GridCellBox)`
    display: grid;
    grid-template-columns: 25px auto 10px auto auto auto auto;
    flex-direction: row;
    align-items: center;
    justify-items: center;
    justify-content: space-evenly;
    gap: var(--ion-space-8);
    background-color: var(--ion-color-light-shade);
    color: var(--ion-color-light-contrast);
    border-bottom: 1px solid var(--ion-color-light);
`

const LegInfoGridCellBox = styled.div`
    width: 100%;
    text-align: center;
`

const LegInfoSeparatorBox = styled.span`
    display: flex;
    border-right: 1px solid var(--ion-color-dark);
    height: 70%;
`




const OrderLegComponent: React.FC<{leg: IAccountOpenOrderLegViewModel}> = observer((props) => {
    const services = useServices();
    return (
        <>
            <LegInfoGridBox>
                <LegInfoGridCellBox>{props.leg.quantity}</LegInfoGridCellBox>
                <LegInfoSeparatorBox/>
                <LegInfoGridCellBox>{props.leg.optionType}</LegInfoGridCellBox>
                <LegInfoSeparatorBox/>
                <LegInfoGridCellBox>{services.time.formatUserFriendlyMonthDay(props.leg.expirationDate ?? null)}</LegInfoGridCellBox>
                <LegInfoSeparatorBox/>
                <LegInfoGridCellBox>{props.leg.strikePrice}</LegInfoGridCellBox>
            </LegInfoGridBox>

            <RightGridCellBox>{props.leg.price}</RightGridCellBox>
            <CenteredGridCellBox>{props.leg.daysToExpiration}</CenteredGridCellBox>
        </>
    )
})


const OrderHeaderComponent: React.FC<{order: IAccountOpenOrderViewModel}> = observer(props => {

    const daysToExpiration =  props.order.legs.filter(l => !Check.isNullOrUndefined(l.daysToExpiration))
                                                      .map(l => l.daysToExpiration ?? 0);

    return (
        <>
            <GridCellBox>
                {`Order id: ${props.order.id}`}
            </GridCellBox>
            <RightGridCellBox>
                {props.order.tradingPrice}
            </RightGridCellBox>
            <CenteredGridCellBox>
                {daysToExpiration.length > 0 ? Math.min(...daysToExpiration) : null}
            </CenteredGridCellBox>
        </>

    )
})

const OrderComponent: React.FC<{order: IAccountOpenOrderViewModel}> = observer(props => {
    const legs = [...props.order.legs].sort((l1, l2) => (l1.strikePrice ?? 0) - (l2.strikePrice ?? 0));
    return (
        <OrderBox>
            <OrderHeaderComponent order={props.order}/>
            {legs.map(leg => (<OrderLegComponent key={leg.symbol} leg={leg}/>))}
        </OrderBox>
    )
})

const UnderlyingSymbolOpenOrdersComponent: React.FC<{underlyingSymbol: string, openOrders: IAccountOpenOrderViewModel[]}> = observer((props) => {
    return (
        <UnderlyingSymbolBox>
            <SymbolBox>{props.underlyingSymbol}</SymbolBox>
            <OrdersBox>
                {props.openOrders.map(o => <OrderComponent key={o.id} order={o}/>)}
            </OrdersBox>
        </UnderlyingSymbolBox>
    )
})

export const OpenPositionsPage: React.FC = observer(() => {
    const [openOrders, setOpenOrders] = React.useState<IAccountOpenOrderViewModel[]>([]);

    const services = useServices();
    useEffect(() => {
        if(services.brokers.currentAccount) {

            /*
            services.brokers.currentAccount.getOpenPositions().then((data) => {
                const groupedBySymbol = data.groupByKey(item => item.underlyingSymbol);
                console.log(groupedBySymbol);
            })

             */

            services.brokers.currentAccount.getOpenOrders().then(orders => {
               setOpenOrders(orders);
            });


        }
    }, [services.brokers.currentAccount]);


    const ordersByUnderlying = openOrders.groupByKey(o => o.underlyingSymbol);

    return (
        <TastyScannerStandardPage>
            <PageContentBox>
                {Object.keys(ordersByUnderlying).map(underlyingSymbol => (<UnderlyingSymbolOpenOrdersComponent key={underlyingSymbol} underlyingSymbol={underlyingSymbol} openOrders={ordersByUnderlying[underlyingSymbol]}/>))}
            </PageContentBox>
        </TastyScannerStandardPage>
    )
})