import React, {PropsWithChildren} from "react";
import {observer} from "mobx-react";
import {useServices} from "../../hooks/use-services.hook";
import {
    IonAccordionGroup,
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

interface StrategiesTabComponentProps extends PropsWithChildren {
    title: string;
}



export const TickerStrategiesComponent: React.FC = observer(() => {
    const services = useServices();

    const ticker = services.tickers.currentTicker;

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
        <IonTabs>

            <IonTabBar slot="top">
                <IonTabButton tab="condors">
                    <IonIcon />
                    Iron Condors
                </IonTabButton>
                <IonTabButton tab="putCreditSpreads">
                    <IonIcon />
                    PUT Credit Spreads
                </IonTabButton>
                <IonTabButton tab="callCreditSpreads">
                    <IonIcon />
                    CALL Credit Spreads
                </IonTabButton>
            </IonTabBar>

            <IonTab tab={"condors"}>
                <IonPage id={"condors"}>
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

            <IonTab tab={"putCreditSpreads"}>
                <IonPage id={"putCreditSpreads"}>
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

            <IonTab tab={"callCreditSpreads"}>
                <IonPage id={"callCreditSpreads"}>
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