import React, {useEffect} from "react";
import {observer} from "mobx-react";
import {TastyScannerStandardPage} from "../tasty-scanner-standard.page";
import {useServices} from "../../hooks/use-services.hook";
import {
    IAccountOpenOrderLegViewModel,
    IAccountOpenOrderViewModel
} from "../../services/brokers/interfaces/account-open-order-interface";
import styled from "styled-components";


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

const UnderlyingOrdersBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--ion-space-8);
    padding-left: var(--ion-space-24);
`

const OrderBox = styled.div`
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
`

const GridCellBox = styled.div`
    padding: var(--ion-space-8);
    border-bottom: 1px solid var(--ion-color-border);
`

const MoneyGridCellBox = styled(GridCellBox)`
    text-align: right;
`

const LegInfoBox = styled(GridCellBox)`
    display: grid;
    grid-template-columns: 25px 10px auto auto;
    flex-direction: row;
    align-items: center;
    justify-items: center;
    gap: var(--ion-space-8);
`

const LegQuantityBox = styled.div`
    text-align: right;
    width: 100%;
`

const OrderLegComponent: React.FC<{leg: IAccountOpenOrderLegViewModel}> = observer((props) => {
    const services = useServices();
    return (
        <>
            <LegInfoBox>
                <LegQuantityBox>{props.leg.quantity}</LegQuantityBox>
                <div>{props.leg.optionType}</div>
                <div>{services.time.formatYYYY_MM_DD(props.leg.expirationDate ?? null)}</div>
                <div>{props.leg.strikePrice}</div>
            </LegInfoBox>

            <MoneyGridCellBox>{props.leg.price}</MoneyGridCellBox>
        </>
    )
})


const OrderHeaderComponent: React.FC<{order: IAccountOpenOrderViewModel}> = observer(props => {
    return (
        <>
            <GridCellBox>
                {props.order.id}
            </GridCellBox>
            <MoneyGridCellBox>
                {props.order.tradingPrice.toFixed(2)}
            </MoneyGridCellBox>
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
            <UnderlyingOrdersBox>
                {props.openOrders.map(o => <OrderComponent key={o.id} order={o}/>)}
            </UnderlyingOrdersBox>
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