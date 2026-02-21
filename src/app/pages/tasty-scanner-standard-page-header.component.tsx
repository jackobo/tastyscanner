import React from "react";
import {observer} from "mobx-react";
import {SymbolSearchDropDownComponent} from "../components/symbol-search-drop-down.component";
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



export const TastyScannerStandardPageHeaderComponent: React.FC = observer(() => {
    const services = useServices();
    const ticker = services.tickers.currentTicker;


    return (
        <PageTitleBox>
            <SymbolSearchDropDownComponent/>
            <span>{ticker?.currentPrice?.toFixed(2)}</span>
            <span>|</span>
            <IVRankBox $ivr={ticker?.ivRank ?? 0}>
                <span>IVR:</span>
                <span>{ticker?.ivRank}</span>
            </IVRankBox>
            <span>|</span>
            <span>Beta:</span>
            <span>{ticker?.beta?.toFixed(2)}</span>
            <TickerDescriptionBox>
                {ticker?.description}
            </TickerDescriptionBox>
        </PageTitleBox>

    )
})