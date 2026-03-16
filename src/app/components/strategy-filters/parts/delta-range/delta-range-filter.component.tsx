import React from "react";
import {observer} from "mobx-react";
import {RangeEditorComponent} from "../../common/range-editor/range-editor.component";
import {IStrategyFiltersViewModel} from "../../../../services/strategy-settings/strategy-settings.service.interface";

export const DeltaRangeFilterComponent: React.FC<{filters: IStrategyFiltersViewModel}> = observer((props) => {
    const filters = props.filters;
    return (
        <RangeEditorComponent label="Delta range"
                              min={5}
                              max={49}
                              lower={filters.minDelta}
                              upper={filters.maxDelta}
                              onValueChanged={value => {
                                  filters.minDelta = value.lower;
                                  filters.maxDelta = value.upper;
                              }}/>
    )
})