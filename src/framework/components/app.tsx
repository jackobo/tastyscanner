import React, {useEffect, useRef} from 'react';
import { IonApp, IonSplitPane, setupIonicReact } from '@ionic/react';



/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import {observer} from "mobx-react";

import {DialogsContainerComponent} from "./modal/dialogs-container.component";
import {LoadingIndicatorComponent} from "./loading-indicator/loading-indicator.component";
import styled from "styled-components";

import {ToastContainer} from "react-toastify";
import {ZIndex} from "../types/z-index";
import {useFrameworkServices} from "../hooks/use-framework-services.hook";
import {MAIN_CONTENT} from "../global-constants";
import {RightSideMenuComponent} from "./side-menu/right/right-side-menu.component";
import {LeftSideMenuComponent} from "./side-menu/left/left-side-menu.component";
import {useScreenMediaQueriesChecks} from "../hooks/use-screen-media-queries-checks.hook";


setupIonicReact();

const ToastContainerBox = styled(ToastContainer)`
    z-index: ${ZIndex.Toast};
`

const IonSplitPaneBox = styled(IonSplitPane)`
    
`

const ToastContainerComponent: React.FC  = observer(() => {
    const services = useFrameworkServices();
    const elementRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if(elementRef.current) {
            services.toaster.setContainerElementRef(elementRef.current);
        }
    }, [services.toaster]);

    return (
        <div ref={elementRef}>
            <ToastContainerBox/>
        </div>

    )
})

interface AppProps {
    appTitle: string;
    renderLogo?: () => React.ReactElement;
}
export const App: React.FC<AppProps> = observer((props) => {
    const services = useFrameworkServices();
    const mediaQuery = useScreenMediaQueriesChecks();


    const renderLeftSideMenu = () => {
        if(services.leftSideMenu.isVisible) {
            return (
                <LeftSideMenuComponent appTitle={props.appTitle} renderLogo={props.renderLogo}/>
            );
        }

        return null;
    }

    return (
        <IonApp>

                <IonSplitPaneBox contentId={MAIN_CONTENT} when={!mediaQuery.smallScreen}>
                    {renderLeftSideMenu()}
                    <div className={"ion-page"} id={MAIN_CONTENT}>
                        {services.navigator.currentRoute.render()}
                    </div>
                    <RightSideMenuComponent key={services.rightSideMenu.stickySideMenuId}
                                            menuId={services.rightSideMenu.stickySideMenuId}
                                            getCurrentRenderer={() => services.rightSideMenu.currentStickyRenderer}/>
                </IonSplitPaneBox>




            <RightSideMenuComponent key={services.rightSideMenu.nonStickySideMenuId}
                                    menuId={services.rightSideMenu.nonStickySideMenuId}
                                    getCurrentRenderer={() => services.rightSideMenu.currentNonStickyRenderer}/>
            <DialogsContainerComponent key={"dialogs-container"}/>
            <ToastContainerComponent key={"toasters-container"}/>
            <LoadingIndicatorComponent key={"loading-indicator"}/>
        </IonApp>
    );
});

