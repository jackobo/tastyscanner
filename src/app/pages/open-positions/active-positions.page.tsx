import React from "react";
import {observer} from "mobx-react";
import {TastyScannerStandardPage} from "../tasty-scanner-standard.page";
import {useServices} from "../../hooks/use-services.hook";
import styled from "styled-components";
import {SpinnerComponent} from "../../../framework/components/spinner/spinner.component";
import {IonAccordionGroup} from "@ionic/react";

import {ActivePositionsRootHeaderComponent} from "./components/active-positions-root-header.component";
import {UnderlyingSymbolActivePositionsComponent} from "./components/underlying-symbol-active-positions.component";

const PAGE_CONTENT_CSS_CLASS = 'active-positions-page-content'

const PageBox = styled(TastyScannerStandardPage)`
    font-size: var(--ion-font-size-body2);
    & .${PAGE_CONTENT_CSS_CLASS} {
        overflow: hidden;
    }
`

const PageContentBox = styled.div`
    width: 100%;
    flex-grow: 1;
    max-height: 100%;
    overflow-y: auto;
`

export const ActivePositionsPage: React.FC = observer(() => {

    const services = useServices();

    const activePositions = services.brokers.currentAccount?.activeOrders;

    if(!activePositions || activePositions.isLoading) {
        return (
            <SpinnerComponent fillContainer={true}/>
        )
    }


    const ordersByUnderlying = activePositions.orders.groupByKey(o => o.underlyingSymbol);

    return (
        <PageBox pageContentCssClass={PAGE_CONTENT_CSS_CLASS}>

            <ActivePositionsRootHeaderComponent/>

            <PageContentBox>
                <IonAccordionGroup>
                    {Object.keys(ordersByUnderlying).sort((s1, s2) => s1.localeCompare(s2))
                        .map(underlyingSymbol => (<UnderlyingSymbolActivePositionsComponent key={underlyingSymbol} underlyingSymbol={underlyingSymbol} openOrders={ordersByUnderlying[underlyingSymbol]}/>))}
                </IonAccordionGroup>
            </PageContentBox>


        </PageBox>
    )
})