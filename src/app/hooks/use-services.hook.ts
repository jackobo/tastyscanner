import {useContext} from "react";
import {AppServiceFactoryContext} from "../react-contexts/app-service-factory-context";

export function useServices() {
    return useContext(AppServiceFactoryContext);
}
