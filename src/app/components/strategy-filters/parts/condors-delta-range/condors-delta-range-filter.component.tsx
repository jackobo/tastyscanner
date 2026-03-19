import React from "react";
import {observer} from "mobx-react";
import {IStrategyFiltersViewModel} from "../../../../services/strategy-settings/strategy-settings.service.interface";
import {RangeEditorComponent} from "../../common/range-editor/range-editor.component";

export const CondorsDeltaRangeFilterComponent: React.FC<{filters: IStrategyFiltersViewModel}> = observer((props) => {
    const filters = props.filters;
    return (
        <RangeEditorComponent label="Condors delta range"
                              min={-5}
                              max={5}
                              lower={filters.condorsMinDelta}
                              upper={filters.condorsMaxDelta}
                              tooltip={"Condors delta range: Only the Iron Condors with total delta within this range will be considered."}
                              onValueChanged={value => {
                                  filters.condorsMinDelta = value.lower;
                                  filters.condorsMaxDelta = value.upper;
                              }}/>
    )
});
