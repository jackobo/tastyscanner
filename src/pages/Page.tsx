import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Page.css';
import {observer} from "mobx-react-lite";
import {useServices} from "../hooks/use-services.hook";
import styled from 'styled-components';

const PageTitleBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px
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
                            <span>IVR:</span>
                            <span>{ticker?.ivRank}</span>
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
