import React from "react";
import {observer} from "mobx-react";
import {useServices} from "../../hooks/use-services.hook";
import {SymbolSearchDropDownComponent} from "../ticker/symbol-search-drop-down.component";
import styled from "styled-components";
import {LoginButtonComponent} from "../login/login-button.component";
import {AppLogo} from "../logo/app-logo.component";

const HeaderContainerBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--ion-space-8);
    width: 100%;
    padding: var(--ion-space-8);
`

const SymbolSearchContainerBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--ion-space-8);
    flex-grow: 1;
`

const AppTitleBox = styled.span`
    font-weight: bold;
    font-size: var(--ion-font-size-h4);
`

export const TastyGobyStandardPageHeaderSmallScreenComponent: React.FC = observer(() => {
    const services = useServices();
    const ticker = services.tickers.currentTicker;

    const renderSearchSymbol = () => {
        if(!services.user.isAuthenticated) {
            return (
                <>
                    <AppLogo/>
                    <AppTitleBox>Tasty Goby</AppTitleBox>
                </>
            );
        }
        return (
            <>
                <SymbolSearchDropDownComponent/>
                <span>{ticker?.currentPrice?.toFixed(2)}</span>
            </>
        )
    }

    return (
        <HeaderContainerBox>
            <SymbolSearchContainerBox>
                {renderSearchSymbol()}
            </SymbolSearchContainerBox>

            {services.user.isAuthenticated ? null : <LoginButtonComponent/>}

        </HeaderContainerBox>
    )
})