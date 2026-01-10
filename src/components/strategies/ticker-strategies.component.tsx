import React, {useEffect} from "react";
import {observer} from "mobx-react";
import {useServices} from "../../hooks/use-services.hook";
import {
    IonContent,
    IonHeader,
    IonIcon,
    IonPage,
    IonSpinner,
    IonTab,
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import styled from "styled-components";
import {IronCondorsComponent} from "./iron-condors.component";
import {PutCreditSpreadsComponent} from "./put-credit-spreads.component";
import {CallCreditSpreadsComponent} from "./call-credit-spreads.component";
import {RawLocalStorageKeys} from "../../services/storage/raw-local-storage/raw-local-storage-keys";

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

const TabHeaderTitleBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;;
`

const LegendContainerBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    flex-grow: 1;
    gap: 8px;
    width: 100%;
    font-size: 0.8rem;
`

const LegendBox = styled.div`
    padding: 8px;
    border-radius: 8px;
    min-width: 100px;
    text-align: center;
`

const BestRiskRewardLegendBox = styled(LegendBox)`
    background-color: var(--ion-color-primary-tint);
    color: var(--ion-color-primary-contrast);
`

const BestPopLegendBox = styled(LegendBox)`
    background-color: var(--ion-color-warning-tint);
    color: var(--ion-color-warning-contrast);
`



const TabHeaderComponent: React.FC<{title: string}> = observer((props) => {
    return (
        <IonHeader>
            <IonToolbar>
                <IonTitle>
                    <TabHeaderTitleBox>
                        <span>
                            {props.title}
                        </span>
                        <LegendContainerBox>
                            <BestRiskRewardLegendBox>
                                Best risk/reward
                            </BestRiskRewardLegendBox>
                            <BestPopLegendBox>
                                Best POP
                            </BestPopLegendBox>
                        </LegendContainerBox>

                    </TabHeaderTitleBox>

                </IonTitle>
            </IonToolbar>
        </IonHeader>
    )
})


export const TickerStrategiesComponent: React.FC = observer(() => {
    const services = useServices();


    const ticker = services.tickers.currentTicker;
    const currentTab = services.rawLocalStorage.getItem(RawLocalStorageKeys.currentStrategyTab) || CONDORS_TAB;

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
                       onIonTabsDidChange={e => services.rawLocalStorage.setItem(RawLocalStorageKeys.currentStrategyTab, e.detail.tab)}>
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
                    <TabHeaderComponent title={"Iron Condors"}/>
                    <IonContent>
                        <IronCondorsComponent ticker={ticker} />
                    </IonContent>
                </IonPage>

            </IonTab>

            <IonTab tab={PUT_CREDIT_SPREAD_TAB}>
                <IonPage id={PUT_CREDIT_SPREAD_TAB}>
                    <TabHeaderComponent title={"PUT Credit Spreads"}/>
                    <IonContent>
                        <PutCreditSpreadsComponent ticker={ticker}/>
                    </IonContent>
                </IonPage>

            </IonTab>

            <IonTab tab={CALL_CREDIT_SPREAD_TAB}>
                <IonPage id={CALL_CREDIT_SPREAD_TAB}>
                    <TabHeaderComponent title={"CALL Credit Spreads"}/>
                    <IonContent>
                        <CallCreditSpreadsComponent ticker={ticker}/>
                    </IonContent>
                </IonPage>

            </IonTab>


        </IonTabs>

    )
})