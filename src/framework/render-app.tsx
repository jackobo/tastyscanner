import './extensions/array.extensions';
import {IFrameworkServiceFactory} from "./services/framework-service-factory.interface";
import React from "react";
import {createRoot} from "react-dom/client";
import {FrameworkServiceFactoryContext} from "./react-contexts/framework-service-factory-context";
import {App} from "./components/app";

export interface IRenderAppOptions<TServiceFactory extends IFrameworkServiceFactory> {
    rootElementId: string;
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
                    {options.renderGlobalStyles()}
                    <App />
                </AppServiceFactoryContext>
            </FrameworkServiceFactoryContext.Provider>
        </React.StrictMode>
    );
}