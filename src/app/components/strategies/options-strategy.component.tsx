import {IOptionsStrategyViewModel} from "../../models/options-strategy.view-model.interface";
import React from "react";
import {observer} from "mobx-react";
import {IonCard} from "@ionic/react";
import {OptionsStrategyHeaderComponent} from "./options-strategy-header.component";
import {OptionsStrategyLegComponent} from "./options-strategy-leg.component";
import {OptionsStrategyFooterComponent} from "./options-strategy-footer.component";
import styled, {css} from "styled-components";

export const StrategyBox = styled.div<{$isBestPop: boolean; $isBestRiskReward: boolean}>`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 24px;
    ${props => props.$isBestPop && css`
        background-color: var(--ion-color-warning-tint);
        color: var(--ion-color-warning-contrast);
    `}
    ${props => props.$isBestRiskReward && css`
        background-color: var(--ion-color-primary-tint);
        color: var(--ion-color-primary-contrast);
    `}

    ${props => props.$isBestRiskReward && props.$isBestPop && css`
        background: linear-gradient(to right, var(--ion-color-primary-tint), var(--ion-color-warning-tint));
        color: var(--ion-color-primary-contrast);
    `}
    
`

export interface OptionsStrategyComponentProps {
    strategy: IOptionsStrategyViewModel;
    bestPop: number;
    bestRiskReward: number;
    onOpenTradeModal: (strategy: IOptionsStrategyViewModel) => void;
}
export const OptionsStrategyComponent: React.FC<OptionsStrategyComponentProps> = observer(props => {
    const isBestRiskReward = props.strategy.riskRewardRatio === props.bestRiskReward;
    const isBestPop = props.strategy.pop === props.bestPop;
    return (
        <IonCard>
            <StrategyBox $isBestRiskReward={isBestRiskReward}
                         $isBestPop={isBestPop}>
                <OptionsStrategyHeaderComponent/>
                {props.strategy.legs.map(leg => (<OptionsStrategyLegComponent key={leg.key} leg={leg}/>))}
                <OptionsStrategyFooterComponent strategy={props.strategy} onOpenTradeDialog={() => props.onOpenTradeModal(props.strategy)}/>
            </StrategyBox>
        </IonCard>
    )
})