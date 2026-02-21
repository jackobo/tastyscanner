import {useContext} from "react";
import {ScreenMediaQueriesChecksContext} from "../react-contexts/scren-media-queries-checks.context";

export function useScreenMediaQueriesChecks() {
    return useContext(ScreenMediaQueriesChecksContext);
}