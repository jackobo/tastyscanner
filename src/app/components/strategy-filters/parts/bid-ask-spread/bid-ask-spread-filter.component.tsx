import React from "react";
import {observer} from "mobx-react";
import {SingleValueEditorComponent} from "../../common/single-value/single-value-editor.component";
import {IStrategyFiltersViewModel} from "../../../../services/strategy-settings/strategy-settings.service.interface";

export const BidAskSpreadFilterComponent: React.FC<{filters: IStrategyFiltersViewModel}> = observer((props) => {
    const filters = props.filters;
    return (
        <SingleValueEditorComponent label="Max bid/ask spread"
                                    min={0}
                                    max={10}
                                    value={filters.maxBidAskSpread}
                                    formatValue={value => `${value}%`}
                                    onValueChanged={value => filters.maxBidAskSpread = value}/>
    )
});
