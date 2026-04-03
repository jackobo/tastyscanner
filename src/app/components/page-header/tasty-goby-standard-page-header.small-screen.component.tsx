import React from "react";
import {observer} from "mobx-react";
import {useServices} from "../../hooks/use-services.hook";
import {SymbolSearchDropDownComponent} from "../ticker/symbol-search-drop-down.component";
import styled from "styled-components";

const HeaderContainerBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
`

export const TastyGobyStandardPageHeaderSmallScreenComponent: React.FC = observer(() => {
    const services = useServices();
    const ticker = services.tickers.currentTicker;
    
    return (
        <HeaderContainerBox>
            <SymbolSearchDropDownComponent/>
            <span>{ticker?.currentPrice?.toFixed(2)}</span>
        </HeaderContainerBox>
    )
})