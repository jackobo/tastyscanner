import {useContext} from "react";
import {FrameworkServiceFactoryContext} from "../react-contexts/framework-service-factory-context";

export function useFrameworkServices() {
    return useContext(FrameworkServiceFactoryContext);
}
