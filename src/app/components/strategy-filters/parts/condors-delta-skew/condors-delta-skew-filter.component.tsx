import React from "react";
import {observer} from "mobx-react";
import {SingleValueEditorComponent} from "../../common/single-value/single-value-editor.component";
import {IStrategyFiltersViewModel} from "../../../../services/strategy-settings/strategy-settings.service.interface";

export const CondorsDeltaSkewFilterComponent: React.FC<{filters: IStrategyFiltersViewModel}> = observer((props) => {
    const filters = props.filters;
    return (
        <SingleValueEditorComponent label="Condors delta skew"
                                    min={-25}
                                    max={25}
                                    value={filters.condorsDeltaSkew}
                                    formatValue={value => value.toString()}
                                    //tooltip={"Max risk/reward: The ratio between the wings size and the credit received."}
                                    onValueChanged={value => filters.condorsDeltaSkew = value}/>
    )
});
