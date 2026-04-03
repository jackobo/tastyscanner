import React from "react";
import {observer} from "mobx-react";
import styled, {css} from "styled-components";
import {useServices} from "../../hooks/use-services.hook";
import {SymbolSearchDropDownComponent} from "../ticker/symbol-search-drop-down.component";
import {LeftSideContainerBox} from "./boxes/left-side-container.box";
import {HeaderForAnonymousUserComponent} from "./boxes/header-for-anonymous-user.component";
import {HeaderContainerBox} from "./boxes/header-container.box";


const computeIvrColor = (ivr: number) => {
    if(ivr <= 30) {
        return css`
            color: var(--ion-color-danger);
        `
    } else if (ivr > 40) {
        return css`
            color: var(--ion-color-success);
        `
    }
    return css`
            color: var(--ion-color-dark);
        `;
}


const IVRankBox = styled.div<{$ivr: number}>`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    ${props => computeIvrColor(props.$ivr)}
`


const TickerDescriptionBox = styled.span`
    flex-grow: 1;
    text-align: right;
`

const ForAuthorizedUserComponent: React.FC = observer(() => {
    const services = useServices();
    const ticker = services.tickers.currentTicker;
    const metrics = ticker?.metrics;
    const info = ticker?.info;
    return (
        <HeaderContainerBox>
            <LeftSideContainerBox>
                <SymbolSearchDropDownComponent/>
                <span>{ticker?.currentPrice?.toFixed(2)}</span>
                <span>|</span>
                <IVRankBox $ivr={metrics?.ivRank ?? 0}>
                    <span>IVR:</span>
                    <span>{metrics?.ivRank}</span>
                </IVRankBox>
                <span>|</span>
                <span>Beta:</span>
                <span>{metrics?.beta?.toFixed(2)}</span>
            </LeftSideContainerBox>

            <TickerDescriptionBox>
                {info?.description}
            </TickerDescriptionBox>

        </HeaderContainerBox>
    )
})

export const TastyGobyStandardPageHeaderLargeScreenComponent: React.FC = observer(() => {
    const services = useServices();
    if(services.user.isAuthenticated) {
        return <ForAuthorizedUserComponent/>
    }
    return <HeaderForAnonymousUserComponent/>
})