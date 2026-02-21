import React from "react";
import {StrategyFiltersComponent} from "../../../../../components/side-menu/filters/strategy-filters.component";
import {TriggerRightSideMenuRendererBase} from "../trigger-right-side-menu-renderer-base.model";

export class FiltersRightSideMenuRendererModel extends TriggerRightSideMenuRendererBase{

    renderContent(): React.ReactElement {
        return (<StrategyFiltersComponent/>)
    }

}