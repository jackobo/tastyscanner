import React from "react";
import {WatchListsComponent} from "../../../../../components/watch-lists/watch-lists.component";
import {TriggerRightSideMenuRendererBase} from "../trigger-right-side-menu-renderer-base.model";

export class WatchListsRightSideMenuRendererModel extends TriggerRightSideMenuRendererBase {

    renderContent(): React.ReactElement {
        return (<WatchListsComponent/>)
    }

}