import React, {useEffect} from "react";
import {observer} from "mobx-react";
import {useServices} from "../../hooks/use-services.hook";
import {
    IonContent,
    IonHeader,
    IonIcon,
    IonPage,
    IonSpinner,
    IonTab, IonTabBar, IonTabButton,
    IonTabs,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import styled from "styled-components";
import {IronCondorsComponent} from "./iron-condors.component";
import {PutCreditSpreadsComponent} from "./put-credit-spreads.component";
import {CallCreditSpreadsComponent} from "./call-credit-spreads.component";

const SpinnerContainerBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
`

const CONDORS_TAB = 'condors';
const PUT_CREDIT_SPREAD_TAB = 'putCreditSpreads';
const CALL_CREDIT_SPREAD_TAB = 'callCreditSpreads';
const STRATEGIES_TABS_CSS_CLASS = "strategies-tabs";

export const TickerStrategiesComponent: React.FC = observer(() => {
    const services = useServices();


    const ticker = services.tickers.currentTicker;
    const currentTab = localStorage.getItem('currentStrategyTab') || CONDORS_TAB;

    useEffect(() => {
        const tabs = document.querySelector(`.${STRATEGIES_TABS_CSS_CLASS}`) as HTMLIonTabsElement;
        tabs?.select(currentTab);
    });

    if(!ticker) {
        return null;
    }

    if(ticker.isLoading) {
        return (
            <SpinnerContainerBox>
                <IonSpinner name="circles"/>
            </SpinnerContainerBox>

        )
    }



    return (
        <IonTabs className={STRATEGIES_TABS_CSS_CLASS}>

            <IonTabBar slot="top"
                       onIonTabsDidChange={e => localStorage.setItem('currentStrategyTab', e.detail.tab)}>
                <IonTabButton tab={CONDORS_TAB}>
                    <IonIcon />
                    Iron Condors
                </IonTabButton>
                <IonTabButton tab={PUT_CREDIT_SPREAD_TAB}>
                    <IonIcon />
                    PUT Credit Spreads
                </IonTabButton>
                <IonTabButton tab={CALL_CREDIT_SPREAD_TAB}>
                    <IonIcon />
                    CALL Credit Spreads
                </IonTabButton>
            </IonTabBar>

            <IonTab tab={CONDORS_TAB}>
                <IonPage id={CONDORS_TAB}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>{"Iron Condors"}</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <IronCondorsComponent ticker={ticker} />
                    </IonContent>
                </IonPage>

            </IonTab>

            <IonTab tab={PUT_CREDIT_SPREAD_TAB}>
                <IonPage id={PUT_CREDIT_SPREAD_TAB}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>{"PUT Credit Spreads"}</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <PutCreditSpreadsComponent ticker={ticker}/>
                    </IonContent>
                </IonPage>

            </IonTab>

            <IonTab tab={CALL_CREDIT_SPREAD_TAB}>
                <IonPage id={CALL_CREDIT_SPREAD_TAB}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>{"CALL Credit Spreads"}</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <CallCreditSpreadsComponent ticker={ticker}/>
                    </IonContent>
                </IonPage>

            </IonTab>


        </IonTabs>

    )
})