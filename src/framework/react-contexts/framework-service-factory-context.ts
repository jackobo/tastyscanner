import React from "react";
import {IFrameworkServiceFactory} from "../services/framework-service-factory.interface";

export const FrameworkServiceFactoryContext = React.createContext<IFrameworkServiceFactory>(null!);