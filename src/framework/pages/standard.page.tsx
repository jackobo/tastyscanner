import React, {PropsWithChildren, useEffect, useRef} from "react";
import {IonButtons, IonContent, IonFooter, IonHeader, IonMenuButton, IonPage, IonToolbar} from '@ionic/react';
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
    
    ${props => props.theme.screenMediaQuery.smallScreen} {
        --padding-start: 0;
        --padding-end: 0;
    }
`

const PageContentBox = styled.div`
    container-type: inline-size;
    flex-grow: 1;
`

const PageHeaderContentContainerBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    
`

export interface StandardPageProps extends PropsWithChildren {
    renderHeaderContent?: () => string | React.ReactElement;
    renderCustomHeader?: () => React.ReactElement;
    renderFooterContent?: () => string | React.ReactElement | null;
    className?: string;
    pageContentWrapperCssClass?: string;
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

    const renderMenuButton = () => {
        if(services.leftSideMenu.isVisible) {
            return (
                <IonButtons slot="start">
                    <IonMenuButton/>
                </IonButtons>
            );
        }

        return null;
    }

    const renderHeader = () => {
        if(props.renderCustomHeader) {
            return props.renderCustomHeader();
        }

        const renderHeaderContent = () => {
            if(props.renderHeaderContent) {
                return props.renderHeaderContent();
            }

            return null;
        }

        return (
            <IonHeader>
                <IonToolbar>
                    {renderMenuButton()}
                    <PageHeaderContentContainerBox>{renderHeaderContent()}</PageHeaderContentContainerBox>
                </IonToolbar>
            </IonHeader>
        )
    }

    const renderFooter = () => {
        if(!props.renderFooterContent) {
            return null;
        }

        const footerContent = props.renderFooterContent();
        if(!footerContent) {
            return null;
        }

        return (
            <IonFooter>
                <IonToolbar>
                    {footerContent}
                </IonToolbar>
            </IonFooter>
        );
    }

    return (
        <IonPage className={props.className}>
            {renderHeader()}
            <IonContentBox className={props.pageContentWrapperCssClass}>
                <PageContentBox ref={contentRef} className={props.pageContentCssClass}>
                    <ContainerMediaQueriesChecksContext.Provider value={containerMediaChecks.current}>
                        <ThemeProvider theme={services.theme.applyContainerMediaQueries() as any}>
                            {props.children}
                        </ThemeProvider>
                    </ContainerMediaQueriesChecksContext.Provider>
                </PageContentBox>
            </IonContentBox>
            {renderFooter()}
        </IonPage>
    );
});


