import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Page.css';
import {observer} from "mobx-react-lite";
import {useServices} from "../hooks/use-services.hook";

const Page: React.FC = observer(() => {
    const services = useServices();
    const ticker = services.optionsChains.currentTicker;
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton/>
                    </IonButtons>
                    <IonTitle>
                        <span>{ticker.symbol}</span>
                        <span>:</span>
                        <span>{ticker.currentPrice}</span>
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
