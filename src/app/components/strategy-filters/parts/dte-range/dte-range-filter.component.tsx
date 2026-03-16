import React from "react";
import {observer} from "mobx-react";
import {RangeEditorComponent} from "../../common/range-editor/range-editor.component";
import {IStrategyFiltersViewModel} from "../../../../services/strategy-settings/strategy-settings.service.interface";

export const DTEFilterComponent: React.FC<{filters: IStrategyFiltersViewModel}> = observer((props) => {
    const filters = props.filters;
    return (
        <RangeEditorComponent label="DTE range"
                              min={0}
                              max={90}
                              lower={filters.minDaysToExpiration}
                              upper={filters.maxDaysToExpiration}
                              onValueChanged={value => {
                                  filters.minDaysToExpiration = value.lower;
                                  filters.maxDaysToExpiration = value.upper;
                              }}/>
    )
})