import React from "react";
import {observer} from "mobx-react";
import {TastyGobyStandardPage} from "../tasty-goby-standard.page";
import {useServices} from "../../hooks/use-services.hook";
import styled from "styled-components";
import {SpinnerComponent} from "../../../framework/components/spinner/spinner.component";
import {IonAccordionGroup} from "@ionic/react";

import {ActivePositionsRootHeaderComponent} from "./components/active-positions-root-header.component";
import {UnderlyingSymbolActivePositionsComponent} from "./components/underlying-symbol-active-positions.component";

const PAGE_CONTENT_CSS_CLASS = 'active-positions-page-content'

const PageBox = styled(TastyGobyStandardPage)`
    font-size: var(--ion-font-size-body2);
    & .${PAGE_CONTENT_CSS_CLASS} {
        overflow: hidden;
        ${props => props.theme.screenMediaQuery.smallScreen} {
            overflow-x: auto;
        }
    }
`

const PageContentBox = styled.div<{$isExpanded: boolean}>`
    width: 100%;
    flex-grow: 1;
    max-height: 100%;
    overflow-y: auto;
    padding-bottom: var(--ion-space-30);
    ${props => props.theme.screenMediaQuery.smallScreen} {
        width: ${props => props.$isExpanded ? 'fit-content' : '100%'} ;
    }
`

export const ActivePositionsPage: React.FC = observer(() => {
    const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
    const services = useServices();

    const activePositions = services.brokers.currentAccount?.activePositions;

    if(!activePositions || activePositions.isLoading) {
        return (
            <SpinnerComponent fillContainer={true}/>
        )
    }


    const ordersByUnderlying = activePositions.positions.groupByKey(o => o.underlyingSymbol);

    return (
        <PageBox pageContentCssClass={PAGE_CONTENT_CSS_CLASS}>

            <ActivePositionsRootHeaderComponent/>

            <PageContentBox $isExpanded={isExpanded}>

                <IonAccordionGroup onIonChange={(e) => setIsExpanded(Boolean(e.detail.value))}>
                    {Object.keys(ordersByUnderlying).sort((s1, s2) => s1.localeCompare(s2))
                        .map(underlyingSymbol => (<UnderlyingSymbolActivePositionsComponent key={underlyingSymbol} underlyingSymbol={underlyingSymbol} openOrders={ordersByUnderlying[underlyingSymbol]}/>))}
                </IonAccordionGroup>
            </PageContentBox>


        </PageBox>
    )
})