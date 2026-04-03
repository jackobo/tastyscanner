import React from "react";
import {observer} from "mobx-react";
import {useScreenMediaQueriesChecks} from "../../../framework/hooks/use-screen-media-queries-checks.hook";
import {
    TastyGobyStandardPageHeaderSmallScreenComponent
} from "./tasty-goby-standard-page-header.small-screen.component";
import {
    TastyGobyStandardPageHeaderLargeScreenComponent
} from "./tasty-goby-standard-page-header.large-screen.component";


export const TastyGobyStandardPageHeaderComponent: React.FC = observer(() => {
    const screenMediaQuery = useScreenMediaQueriesChecks();

    if(screenMediaQuery.smallScreen) {
        return (<TastyGobyStandardPageHeaderSmallScreenComponent/>)
    } else {
        return (<TastyGobyStandardPageHeaderLargeScreenComponent/>)
    }
})