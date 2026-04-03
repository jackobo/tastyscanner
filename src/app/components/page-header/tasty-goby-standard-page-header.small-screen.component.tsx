import React from "react";
import {observer} from "mobx-react";
import {useServices} from "../../hooks/use-services.hook";
import {SymbolSearchDropDownComponent} from "../ticker/symbol-search-drop-down.component";
import {HeaderContainerBox} from "./boxes/header-container.box";
import {LeftSideContainerBox} from "./boxes/left-side-container.box";
import {HeaderForAnonymousUserComponent} from "./boxes/header-for-anonymous-user.component";


const ForAuthorizedUserComponent: React.FC = observer(() => {
    const services = useServices();
    const ticker = services.tickers.currentTicker;
    return (
        <HeaderContainerBox>
            <LeftSideContainerBox>
                <SymbolSearchDropDownComponent/>
                <span>{ticker?.currentPrice?.toFixed(2)}</span>
            </LeftSideContainerBox>
        </HeaderContainerBox>
    )
})



export const TastyGobyStandardPageHeaderSmallScreenComponent: React.FC = observer(() => {
    const services = useServices();
    if(services.user.isAuthenticated) {
        return <ForAuthorizedUserComponent/>
    } else {
        return <HeaderForAnonymousUserComponent/>
    }

})