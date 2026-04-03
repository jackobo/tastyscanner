import React from "react";
import { observer } from "mobx-react";
import {useServices} from "../../hooks/use-services.hook";
import styled from "styled-components";
import {RiskRewardFilterComponent} from "./parts/risk-reward/risk-reward-filter.component";
import {StrikesDeltaRangeFilterComponent} from "./parts/strikes-delta-range/strikes-delta-range-filter.component";
import {DTEFilterComponent} from "./parts/dte-range/dte-range-filter.component";
import {BidAskSpreadFilterComponent} from "./parts/bid-ask-spread/bid-ask-spread-filter.component";
import {WingsWidthFilterComponent} from "./parts/wings-width/wings-width-filter.component";
import {ByEarningsDateFilterComponent} from "./parts/by-earnings-date/by-earnings-date-filter.component";
import {CondorsShortLegsDeltaRangeFilterComponent} from "./parts/condors-short-legs-delta-range/condors-short-legs-delta-range-filter.component";
import {ByExistingPositionsFilterComponent} from "./parts/by-existing-positions/by-existing-positions-filter.component";
import {PopFilterComponent} from "./parts/pop/pop-filter.component";
import {BestStrategyFilterComponent} from "./parts/best-strategy/best-strategy-filter.component";
import {
    CondorsRiskRewardPerWingFilterComponent
} from "./parts/condors-risk-reward-per-wing/condors-risk-reward-per-wing-filter.component";


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
            <BestStrategyFilterComponent filters={filters}/>
            <RiskRewardFilterComponent filters={filters}/>
            <CondorsRiskRewardPerWingFilterComponent filters={filters}/>
            <PopFilterComponent filters={filters}/>
            <StrikesDeltaRangeFilterComponent filters={filters}/>
            <CondorsShortLegsDeltaRangeFilterComponent filters={filters}/>
            <DTEFilterComponent filters={filters}/>
            <BidAskSpreadFilterComponent filters={filters}/>
            <WingsWidthFilterComponent filters={filters}/>
            <ByExistingPositionsFilterComponent filters={filters}/>
            <ByEarningsDateFilterComponent filters={filters}/>
        </FiltersContainerBox>
    )
})