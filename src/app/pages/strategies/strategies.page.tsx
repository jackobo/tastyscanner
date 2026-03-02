import React, {useRef} from "react";
import {observer} from "mobx-react-lite";
import {TastyScannerStandardPage} from "../tasty-scanner-standard.page";
import {IVerticalTabViewModel} from "../../components/vertical-tabs/vertical-tab.view-model.interface";
import {IronCondorsTabModel} from "./components/vertical-tabs/iron-condors.tab.model";
import {useServices} from "../../hooks/use-services.hook";
import {PutCreditSpreadsTabModel} from "./components/vertical-tabs/put-credi-spreads.tab.model";
import {CallCreditSpreadsTabModel} from "./components/vertical-tabs/call-credi-spreads.tab.model";
import {VerticalTabsComponent} from "../../components/vertical-tabs/vertical-tabs.component";
import {SpinnerComponent} from "../../../framework/components/spinner/spinner.component";
import styled from "styled-components";


const NoTickerSelectedBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--ion-color-danger);
    width: 100%;
    height: 100%;
`


export const StrategiesPage: React.FC = observer(() => {
    const services = useServices();
    const tabsRef = useRef<IVerticalTabViewModel[]>([
        new IronCondorsTabModel(services),
        new PutCreditSpreadsTabModel(services),
        new CallCreditSpreadsTabModel(services),
    ])

    const ticker = services.tickers.currentTicker;

    const renderPageContent = () => {
        if(!ticker) {
            return (
                <NoTickerSelectedBox>
                    {services.language.translate('No ticker selected.')}
                </NoTickerSelectedBox>
            );
        }
        if(ticker.isLoading) {
            return (
                <SpinnerComponent fillContainer={true} />
            );
        }

        return (
            <VerticalTabsComponent tabs={tabsRef.current}/>
        );
    }

    return (
        <TastyScannerStandardPage>
            {renderPageContent()}
        </TastyScannerStandardPage>
    )
});

