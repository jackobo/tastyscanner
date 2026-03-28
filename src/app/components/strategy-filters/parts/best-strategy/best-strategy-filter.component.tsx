import {observer} from "mobx-react";
import React from "react";
import {
    BestStrategyEnum,
    IStrategyFiltersViewModel
} from "../../../../services/strategy-settings/strategy-settings.service.interface";
import {FilterContainerComponent} from "../../common/filter-container/filter-container.component";
import {FilterLabelComponent} from "../../common/filter-label/filter-label.component";
import styled from "styled-components";
import {CheckboxComponent} from "../../../../../framework/components/checkbox/checkbox.component";
import {BEST_POP, BEST_RISK_REWARD} from "../../../../pages/strategies/components/best-strategies-colors";

const ContainerBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    padding-bottom: var(--ion-space-12);
    padding-top: var(--ion-space-12);
    gap: var(--ion-space-8);
    width: 100%;
`


const BestPopBox = styled(CheckboxComponent)`
    color: ${BEST_POP};
`

const BestRiskRewardBox = styled(CheckboxComponent)`
    color: ${BEST_RISK_REWARD};
`

export const BestStrategyFilterComponent: React.FC<{filters: IStrategyFiltersViewModel}> = observer((props) => {


    const checkUncheckStrategy = (strategy: BestStrategyEnum, check: boolean) => {
        let bestStrategies = props.filters.bestStrategy;
        if(check) {
            bestStrategies.push(strategy);
        } else {
            bestStrategies = bestStrategies.filter(s => s !== strategy);
        }

        props.filters.bestStrategy = bestStrategies.distinct(s => s.toString());
    }

    return (
        <FilterContainerComponent>
            <FilterLabelComponent>
                Best strategy
            </FilterLabelComponent>
            <ContainerBox>

                <BestPopBox checked={ props.filters.bestStrategy.includes(BestStrategyEnum.BestPOP)}
                            onChange={checked => checkUncheckStrategy(BestStrategyEnum.BestPOP, checked)}
                            label="Best POP"/>

                <BestRiskRewardBox checked={ props.filters.bestStrategy.includes(BestStrategyEnum.BestRiskReward)}
                                   onChange={checked => checkUncheckStrategy(BestStrategyEnum.BestRiskReward, checked)}
                                   label="Best Rsk/Rwrd"/>

            </ContainerBox>

        </FilterContainerComponent>
    )
})