import React from 'react';
import {IAppServiceFactory} from "../services/app-service-factory.interface";

export const AppServiceFactoryContext = React.createContext<IAppServiceFactory>(null!);
