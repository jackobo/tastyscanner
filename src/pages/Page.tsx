import React from "react";
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Page.css';
import {observer} from "mobx-react-lite";
import {useServices} from "../hooks/use-services.hook";
import styled, {css} from 'styled-components';

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


const Page: React.FC = observer(() => {
    const services = useServices();
    const ticker = services.tickers.currentTicker;
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton/>
                    </IonButtons>
                    <IonTitle>
                        <PageTitleBox>
                            <span>{ticker?.symbol}</span>
                            <span>{ticker?.currentPrice?.toFixed(2)}</span>
                            <span>|</span>
                            <IVRankBox $ivr={ticker?.ivRank ?? 0}>
                                <span>IVR:</span>
                                <span>{ticker?.ivRank}</span>
                            </IVRankBox>

                            <span>|</span>
                            <span>Beta:</span>
                            <span>{ticker?.beta?.toFixed(2)}</span>
                        </PageTitleBox>

                    </IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">asdfasdfasfds</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <ExploreContainer />
            </IonContent>
        </IonPage>
    );
});

export default Page;
