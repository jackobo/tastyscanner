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
    gap: 8px;
    padding: 16px;
`

const SeparatorBox = styled.hr`
    background-color: var(--ion-color-light-shade);
    height: 1px;
    margin-left: -12px;
    margin-right: -12px;
    box-sizing: border-box;
`


export const StrategyFiltersComponent: React.FC = observer(() => {
    const services = useServices();

    const filters = services.strategySettings.strategyFilters;

    return (
        <FiltersContainerBox>
            <RiskRewardFilterComponent filters={filters}/>

            <SeparatorBox/>

            <DeltaRangeFilterComponent filters={filters}/>

            <SeparatorBox/>

            <DTEFilterComponent filters={filters}/>

            <SeparatorBox/>

            <BidAskSpreadFilterComponent filters={filters}/>

            <SeparatorBox/>

            <WingsWidthFilterComponent filters={filters}/>

            <SeparatorBox/>

            <ByEarningsDateFilterComponent filters={filters}/>


        </FiltersContainerBox>
    )
})