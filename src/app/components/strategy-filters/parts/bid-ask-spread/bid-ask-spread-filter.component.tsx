import React from "react";
import {observer} from "mobx-react";
import {SingleValueEditorComponent} from "../../common/single-value/single-value-editor.component";
import {IStrategyFiltersViewModel} from "../../../../services/strategy-settings/strategy-settings.service.interface";
import styled from "styled-components";

const ToolTipBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`

export const BidAskSpreadFilterComponent: React.FC<{filters: IStrategyFiltersViewModel}> = observer((props) => {
    const filters = props.filters;

    const renderToolTip = () => {
        return (
            <ToolTipBox>
                <div>Max bid/ask spread percentage:</div>
                <div>(askPrice - bidPrice) / bidPrice * 100</div>
                <div>Only legs that have a bid/ask spread percent less than this value will be used to compose the final strategy.</div>
            </ToolTipBox>
        )
    }

    return (
        <SingleValueEditorComponent label="Max bid/ask spread"
                                    min={0}
                                    max={10}
                                    value={filters.maxBidAskSpread}
                                    formatValue={value => `${value}%`}
                                    tooltip={renderToolTip()}
                                    onValueChanged={value => filters.maxBidAskSpread = value}/>
    )
});
