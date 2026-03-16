import React from "react";
import {observer} from "mobx-react";
import {SingleValueEditorComponent} from "../../common/single-value/single-value-editor.component";
import {IStrategyFiltersViewModel} from "../../../../services/strategy-settings/strategy-settings.service.interface";

export const RiskRewardFilterComponent: React.FC<{filters: IStrategyFiltersViewModel}> = observer((props) => {
    const filters = props.filters;
    return (
        <SingleValueEditorComponent label="Max risk/reward"
                                    min={1}
                                    max={10}
                                    value={filters.maxRiskRewardRatio}
                                    formatValue={value => `${value}/1`}
                                    onValueChanged={value => filters.maxRiskRewardRatio = value}/>
    )
});
