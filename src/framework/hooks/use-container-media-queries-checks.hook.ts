import {useContext} from "react";
import {ContainerMediaQueriesChecksContext} from "../react-contexts/container-media-queries-checks.context";

export function useContainerMediaQueriesChecks() {
    return useContext(ContainerMediaQueriesChecksContext);
}