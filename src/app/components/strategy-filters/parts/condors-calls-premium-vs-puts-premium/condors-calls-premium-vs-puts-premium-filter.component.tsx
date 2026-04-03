import React from "react";
import {observer} from "mobx-react";
import {IStrategyFiltersViewModel} from "../../../../services/strategy-settings/strategy-settings.service.interface";
import {SingleValueEditorComponent} from "../../common/single-value/single-value-editor.component";
import {RangeEditorComponent} from "../../common/range-editor/range-editor.component";
import {MathUtils} from "../../../../../framework/utils/math-utils";

export const CondorsCallsPremiumVsPutsPremiumFilterComponent: React.FC<{filters: IStrategyFiltersViewModel}> = observer((props) => {
    const filters = props.filters;
    return (
        <RangeEditorComponent label="Condors calls premium vs puts premium"
                              min={25}
                              max={200}
                              lower={MathUtils.round(filters.condorsMinCallPremiumVsPutPremiumPercentage * 100, 0)}
                              upper={MathUtils.round(filters.condorsMaxCallPremiumVsPutPremiumPercentage * 100, 0)}
                              tooltip={"Condors calls premium vs puts premium: Only the Iron Condors with premiums difference within this range will be considered."}
                              formatValue={value => `${value}%`}
                              onValueChanged={value => {
                                  filters.condorsMinCallPremiumVsPutPremiumPercentage = MathUtils.round(value.lower/100);
                                  filters.condorsMaxCallPremiumVsPutPremiumPercentage = MathUtils.round(value.upper/100);
                              }}/>
    )
});
