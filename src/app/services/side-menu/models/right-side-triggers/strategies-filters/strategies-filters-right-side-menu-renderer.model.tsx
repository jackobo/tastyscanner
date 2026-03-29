import React from "react";
import {StrategyFiltersComponent} from "../../../../../components/strategy-filters/strategy-filters.component";
import {TriggerRightSideMenuRendererBase} from "../trigger-right-side-menu-renderer-base.model";

export class StrategiesFiltersRightSideMenuRendererModel extends TriggerRightSideMenuRendererBase{

    renderContent(): React.ReactElement {
        return (<StrategyFiltersComponent/>)
    }

}