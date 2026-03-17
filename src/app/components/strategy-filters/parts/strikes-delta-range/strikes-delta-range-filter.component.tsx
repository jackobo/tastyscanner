import React from "react";
import {observer} from "mobx-react";
import {RangeEditorComponent} from "../../common/range-editor/range-editor.component";
import {IStrategyFiltersViewModel} from "../../../../services/strategy-settings/strategy-settings.service.interface";

export const StrikesDeltaRangeFilterComponent: React.FC<{filters: IStrategyFiltersViewModel}> = observer((props) => {
    const filters = props.filters;
    return (
        <RangeEditorComponent label="Strikes delta range"
                              min={5}
                              max={49}
                              lower={filters.minDelta}
                              upper={filters.maxDelta}
                              tooltip={"Strikes delta range: Only the strikes with delta within this range will be used to compose the final strategy."}
                              onValueChanged={value => {
                                  filters.minDelta = value.lower;
                                  filters.maxDelta = value.upper;
                              }}/>
    )
})