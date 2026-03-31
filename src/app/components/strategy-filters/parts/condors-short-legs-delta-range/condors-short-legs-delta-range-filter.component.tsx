import React from "react";
import {observer} from "mobx-react";
import {IStrategyFiltersViewModel} from "../../../../services/strategy-settings/strategy-settings.service.interface";
import {RangeEditorComponent} from "../../common/range-editor/range-editor.component";
import {useServices} from "../../../../hooks/use-services.hook";


export const CondorsShortLegsDeltaRangeFilterComponent: React.FC<{filters: IStrategyFiltersViewModel}> = observer((props) => {
    const services = useServices();
    const filters = props.filters;
    const renderToolTip = () => {
        return (
            <>
                <span>
                    {services.language.translate('Condors short legs delta range: Only the Iron Condors with delta computed only for short legs within this range will be considered.')}
                </span>
                <span>
                    {services.language.translate('Short legs delta is calculated by this formula:')}
                </span>
                <span>
                    |SoldPutDelta| - |SoldCallDelta|
                </span>
                <span>
                    {services.language.translate('Basically with this filter you can control how neutral/bullish/bearish you want the condors to be.')}
                </span>
            </>
        )
    }
    return (
        <RangeEditorComponent label="Condors short legs delta range"
                              min={-15}
                              max={15}
                              lower={filters.condorsMinDelta}
                              upper={filters.condorsMaxDelta}
                              tooltip={renderToolTip()}
                              onValueChanged={value => {
                                  filters.condorsMinDelta = value.lower;
                                  filters.condorsMaxDelta = value.upper;
                              }}/>
    )
});
