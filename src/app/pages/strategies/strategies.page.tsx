import React, {useRef} from "react";
import {observer} from "mobx-react-lite";
import {TastyScannerStandardPage} from "../tasty-scanner-standard.page";
import styled from "styled-components";
import {IVerticalTabViewModel} from "../../components/vertical-tabs/vertical-tab.view-model.interface";
import {IronCondorsTabModel} from "./components/vertical-tabs/iron-condors.tab.model";
import {useServices} from "../../hooks/use-services.hook";
import {PutCreditSpreadsTabModel} from "./components/vertical-tabs/put-credi-spreads.tab.model";
import {CallCreditSpreadsTabModel} from "./components/vertical-tabs/call-credi-spreads.tab.model";
import {VerticalTabsComponent} from "../../components/vertical-tabs/vertical-tabs.component";
import {IonSpinnerComponent} from "../../../framework/components/spinner/ion-spinner.component";


const SpinnerContainerBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
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

    if(!ticker || ticker.isLoading) {
        return (
            <SpinnerContainerBox>
                <IonSpinnerComponent/>
            </SpinnerContainerBox>

        )
    }

    return (
        <TastyScannerStandardPage>
            <VerticalTabsComponent tabs={tabsRef.current}/>
        </TastyScannerStandardPage>
    )
});

