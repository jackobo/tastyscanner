import React from "react";
import { observer } from "mobx-react";
import {useServices} from "../../hooks/use-services.hook";
import styled from "styled-components";
import {RiskRewardFilterComponent} from "./parts/risk-reward/risk-reward-filter.component";
import {DeltaRangeFilterComponent} from "./parts/delta-range/delta-range-filter.component";
import {DTEFilterComponent} from "./parts/dte-range/dte-range-filter.component";
import {BidAskSpreadFilterComponent} from "./parts/bid-ask-spread/bid-ask-spread-filter.component";
import {WingsWidthFilterComponent} from "./parts/wings-width/wings-width-filter.component";
import {ByEarningsDateFilterComponent} from "./parts/by-earnings-date/by-earnings-date-filter.component";

const FiltersContainerBox = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`


export const StrategyFiltersComponent: React.FC = observer(() => {
    const services = useServices();

    const filters = services.strategySettings.strategyFilters;

    return (
        <FiltersContainerBox>
            <RiskRewardFilterComponent filters={filters}/>
            <DeltaRangeFilterComponent filters={filters}/>
            <DTEFilterComponent filters={filters}/>
            <BidAskSpreadFilterComponent filters={filters}/>
            <WingsWidthFilterComponent filters={filters}/>
            <ByEarningsDateFilterComponent filters={filters}/>
        </FiltersContainerBox>
    )
})