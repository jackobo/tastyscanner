import React, {PropsWithChildren, useEffect, useRef} from "react";
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import {observer} from "mobx-react";
import styled from "styled-components";
import { ContainerMediaQueriesChecksContext } from "../react-contexts/container-media-queries-checks.context";
import {ContainerMediaQueryChecks} from "../services/media-query/container/container-media-query-checks";
import {useScreenMediaQueriesChecks} from "../hooks/use-screen-media-queries-checks.hook";

const IonContentBox = styled(IonContent)`
    --padding-top: var(--ion-space-20);
    --padding-start: var(--ion-space-20);
    --padding-end: var(--ion-space-20);
    --padding-bottom: var(--ion-space-20);
`

const PageContentBox = styled.div`
    container-type: inline-size;
`

export interface StandardPageProps extends PropsWithChildren {
    renderHeader: () => string | React.ReactElement;
}

export const StandardPage: React.FC<StandardPageProps> = observer((props) => {
    const screenMediaQuery = useScreenMediaQueriesChecks();
    const contentRef = useRef<HTMLDivElement | null>(null);
    const containerMediaChecks = useRef(new ContainerMediaQueryChecks(screenMediaQuery));

    useEffect(() => {
        const mediaChecks = containerMediaChecks.current;
        if (contentRef.current) {
            mediaChecks.setElement(contentRef.current);
        }

        return () => {
            mediaChecks?.dispose();
        }
    }, []);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton/>
                    </IonButtons>
                    <IonTitle>{props.renderHeader()}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContentBox>
                <PageContentBox ref={contentRef}>
                    <ContainerMediaQueriesChecksContext.Provider value={containerMediaChecks.current}>
                        {props.children}
                    </ContainerMediaQueriesChecksContext.Provider>
                </PageContentBox>


            </IonContentBox>
        </IonPage>
    );
});


