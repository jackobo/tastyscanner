import './extensions/array.extensions';
import {IFrameworkServiceFactory} from "./services/framework-service-factory.interface";
import React from "react";
import {createRoot} from "react-dom/client";
import {FrameworkServiceFactoryContext} from "./react-contexts/framework-service-factory-context";
import {App} from "./components/app";
import { ScreenMediaQueriesChecksContext } from './react-contexts/scren-media-queries-checks.context';
import {ThemeProvider} from "styled-components";

export interface IRenderAppOptions<TServiceFactory extends IFrameworkServiceFactory> {
    rootElementId: string;
    appTitle: string;
    serviceFactory: TServiceFactory;
    appServiceFactoryContext: React.Context<TServiceFactory>;
    renderGlobalStyles:() => React.ReactElement;
}

export function renderApp<TServiceFactory extends IFrameworkServiceFactory>(options: IRenderAppOptions<TServiceFactory>) {
    const container = document.getElementById(options.rootElementId);
    if(!container) {
        throw new Error(`Container with id ${options.rootElementId} not found`);
    }
    const root = createRoot(container);
    const AppServiceFactoryContext = options.appServiceFactoryContext;
    root.render(
        <React.StrictMode>
            <FrameworkServiceFactoryContext.Provider value={options.serviceFactory}>
                <AppServiceFactoryContext value={options.serviceFactory}>
                    <ScreenMediaQueriesChecksContext.Provider value={options.serviceFactory.screenMediaQuery}>
                        <ScreenMediaQueriesChecksContext.Provider value={options.serviceFactory.screenMediaQuery}>
                            <ThemeProvider theme={options.serviceFactory.theme as any}>
                                {options.renderGlobalStyles()}
                                <App appTitle={options.appTitle}/>
                            </ThemeProvider>

                        </ScreenMediaQueriesChecksContext.Provider>
                    </ScreenMediaQueriesChecksContext.Provider>

                </AppServiceFactoryContext>
            </FrameworkServiceFactoryContext.Provider>
        </React.StrictMode>
    );
}