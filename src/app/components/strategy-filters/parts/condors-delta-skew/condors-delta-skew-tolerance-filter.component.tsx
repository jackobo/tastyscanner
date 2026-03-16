import React from "react";
import {observer} from "mobx-react";
import {SingleValueEditorComponent} from "../../common/single-value/single-value-editor.component";
import {IStrategyFiltersViewModel} from "../../../../services/strategy-settings/strategy-settings.service.interface";

export const CondorsDeltaSkewToleranceFilterComponent: React.FC<{filters: IStrategyFiltersViewModel}> = observer((props) => {
    const filters = props.filters;
    return (
        <SingleValueEditorComponent label="Condors delta skew tolerance"
                                    min={10}
                                    max={100}
                                    value={filters.condorsDeltaSkewTolerance}
                                    formatValue={value => `${value}%`}
                                    //tooltip={"Max risk/reward: The ratio between the wings size and the credit received."}
                                    onValueChanged={value => filters.condorsDeltaSkewTolerance = value}/>
    )
});
