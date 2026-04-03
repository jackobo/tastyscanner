import React from "react";
import {observer} from "mobx-react";
import {IStrategyFiltersViewModel} from "../../../../services/strategy-settings/strategy-settings.service.interface";
import {SingleValueEditorComponent} from "../../common/single-value/single-value-editor.component";

export const CondorsRiskRewardPerWingFilterComponent: React.FC<{filters: IStrategyFiltersViewModel}> = observer((props) => {
    const filters = props.filters;
    return (
        <SingleValueEditorComponent label="Condors max risk/reward per wing"
                                    min={1}
                                    max={10}
                                    step={0.1}
                                    value={filters.condorsMaxRiskRewardRatioPerWing}
                                    formatValue={value => `${value}/1`}
                                    tooltip={"Condors max risk/reward per wing: Is the risk/reward ratio for each wing of the iron condor (Put Credit Spread and Call Credit Spread)."}
                                    onValueChanged={value => filters.condorsMaxRiskRewardRatioPerWing = value}/>
    )
});
