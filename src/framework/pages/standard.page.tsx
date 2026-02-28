import React, {PropsWithChildren, useEffect, useRef} from "react";
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import {observer} from "mobx-react";
import styled, {ThemeProvider} from "styled-components";
import { ContainerMediaQueriesChecksContext } from "../react-contexts/container-media-queries-checks.context";
import {ContainerMediaQueryChecks} from "../services/media-query/container/container-media-query-checks";
import {useScreenMediaQueriesChecks} from "../hooks/use-screen-media-queries-checks.hook";
import {useFrameworkServices} from "../hooks/use-framework-services.hook";

const IonContentBox = styled(IonContent)`
    --padding-top: var(--ion-space-20);
    --padding-start: var(--ion-space-20);
    --padding-end: var(--ion-space-20);
    --padding-bottom: var(--ion-space-20);
    &::part(scroll) {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
`

const PageContentBox = styled.div`
    container-type: inline-size;
    flex-grow: 1;
`

export interface StandardPageProps extends PropsWithChildren {
    renderHeaderContent?: () => string | React.ReactElement;
    renderCustomHeader?: () => React.ReactElement;
    className?: string;
    pageContentCssClass?: string;
}

export const StandardPage: React.FC<StandardPageProps> = observer((props) => {
    const services = useFrameworkServices();
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

    const renderHeader = () => {
        if(props.renderCustomHeader) {
            return props.renderCustomHeader();
        }

        const renderTitle = () => {
            if(props.renderHeaderContent) {
                return props.renderHeaderContent();
            }

            return null;
        }

        return (
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton/>
                    </IonButtons>
                    <IonTitle>{renderTitle()}</IonTitle>
                </IonToolbar>
            </IonHeader>
        )
    }

    return (
        <IonPage className={props.className}>
            {renderHeader()}
            <IonContentBox>
                <PageContentBox ref={contentRef} className={props.pageContentCssClass}>
                    <ContainerMediaQueriesChecksContext.Provider value={containerMediaChecks.current}>
                        <ThemeProvider theme={services.theme.applyContainerMediaQueries()}>
                            {props.children}
                        </ThemeProvider>

                    </ContainerMediaQueriesChecksContext.Provider>
                </PageContentBox>


            </IonContentBox>
        </IonPage>
    );
});


