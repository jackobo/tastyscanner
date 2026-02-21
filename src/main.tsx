import React from 'react';
import './app/theme/variables.css'
import {AppServiceFactory} from "./app/services/app-service-factory";
import { AppServiceFactoryContext } from './app/react-contexts/app-service-factory-context';
import {renderApp} from "./framework/render-app";
import {GlobalStyles} from "./app/theme/global-styles";

const serviceFactory = new AppServiceFactory();


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
    appTitle: "Tasty Scanner",
    serviceFactory: serviceFactory,
    appServiceFactoryContext: AppServiceFactoryContext,
    renderGlobalStyles: () => (<GlobalStyles/>)
});
