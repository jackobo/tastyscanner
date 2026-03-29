import React from "react";
import {observer} from "mobx-react";
import {SymbolSearchDropDownComponent} from "../components/ticker/symbol-search-drop-down.component";
import styled, {css} from "styled-components";
import {useServices} from "../hooks/use-services.hook";

const PageTitleBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
`
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



export const TastyGobyStandardPageHeaderComponent: React.FC = observer(() => {
    const services = useServices();
    const ticker = services.tickers.currentTicker;
    const metrics = ticker?.metrics;
    const info = ticker?.info;

    return (
        <PageTitleBox>
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
            <TickerDescriptionBox>
                {info?.description}
            </TickerDescriptionBox>
        </PageTitleBox>

    )
})