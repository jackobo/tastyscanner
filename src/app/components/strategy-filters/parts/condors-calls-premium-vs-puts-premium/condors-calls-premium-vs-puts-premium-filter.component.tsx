import React from "react";
import {observer} from "mobx-react";
import {IStrategyFiltersViewModel} from "../../../../services/strategy-settings/strategy-settings.service.interface";
import {RangeEditorComponent} from "../../common/range-editor/range-editor.component";
import {MathUtils} from "../../../../../framework/utils/math-utils";

export const CondorsCallsPremiumVsPutsPremiumFilterComponent: React.FC<{filters: IStrategyFiltersViewModel}> = observer((props) => {
    const filters = props.filters;
    const lower = MathUtils.round(filters.condorsMinCallPremiumVsPutPremiumPercentage * 100, 0);
    const upper = MathUtils.round(filters.condorsMaxCallPremiumVsPutPremiumPercentage * 100, 0);
    return (
        <RangeEditorComponent label="Condors calls premium vs puts premium"
                              min={25}
                              max={300}
                              lower={MathUtils.round(filters.condorsMinCallPremiumVsPutPremiumPercentage * 100, 0)}
                              upper={MathUtils.round(filters.condorsMaxCallPremiumVsPutPremiumPercentage * 100, 0)}
                              tooltip={`Condors calls premium vs puts premium: Only the Iron Condors where the CallSpreadPremium is between PutSpreadPremium x ${lower}% and PutSpreadPremium x ${upper}% will be considered.`}
                              formatValue={value => `${value}%`}
                              onValueChanged={value => {
                                  filters.condorsMinCallPremiumVsPutPremiumPercentage = MathUtils.round(value.lower/100);
                                  filters.condorsMaxCallPremiumVsPutPremiumPercentage = MathUtils.round(value.upper/100);
                              }}/>
    )
});
