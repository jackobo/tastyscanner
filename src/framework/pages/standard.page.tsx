import React, {PropsWithChildren} from "react";
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import {observer} from "mobx-react";
import styled from "styled-components";

const IonContentBox = styled(IonContent)`
    --padding-top: var(--ion-space-20);
    --padding-start: var(--ion-space-20);
    --padding-end: var(--ion-space-20);
    --padding-bottom: var(--ion-space-20);
`

export interface StandardPageProps extends PropsWithChildren {
    header: string | React.ReactElement;
}

export const StandardPage: React.FC<StandardPageProps> = observer((props) => {

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{props.header}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContentBox fullscreen>
        {props.children}
      </IonContentBox>
    </IonPage>
  );
});


