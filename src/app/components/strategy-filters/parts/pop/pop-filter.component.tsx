import React from "react";
import {observer} from "mobx-react";
import {IStrategyFiltersViewModel} from "../../../../services/strategy-settings/strategy-settings.service.interface";
import {SingleValueEditorComponent} from "../../common/single-value/single-value-editor.component";



export const PopFilterComponent: React.FC<{filters: IStrategyFiltersViewModel}> = observer((props) => {
    const filters = props.filters;
    return (
        <SingleValueEditorComponent label="Min POP"
                                    min={0}
                                    max={100}
                                    value={filters.minPop}
                                    formatValue={value => `${value}%`}
                                    tooltip={"Min POP: Minimum probability of profit"}
                                    onValueChanged={value => filters.minPop = value}/>
    )
})