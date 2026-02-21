import React from 'react';
import { createRoot } from 'react-dom/client';
import {AppServiceFactory} from "./app/services/app-service-factory";
import { AppServiceFactoryContext } from './app/react-contexts/app-service-factory-context';
import {renderApp} from "./framework/render-app";
import {GlobalStyles} from "./app/theme/global-styles";

const serviceFactory = new AppServiceFactory();

const container = document.getElementById('root');
const root = createRoot(container!);
/*
root.render(
  <React.StrictMode>
      <AppServiceFactoryContext.Provider value={serviceFactory}>
          <App />
      </AppServiceFactoryContext.Provider>
  </React.StrictMode>
);

 */

renderApp({
    rootElementId: "root",
    serviceFactory: serviceFactory,
    appServiceFactoryContext: AppServiceFactoryContext,
    renderGlobalStyles: () => (<GlobalStyles/>)
});
