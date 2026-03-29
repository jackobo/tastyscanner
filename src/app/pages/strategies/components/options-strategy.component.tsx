import {
    IOptionsStrategyViewModel,
    IOptionsStrategyWithAnnotationsViewModel
} from "../../../models/options-strategy.view-model.interface";
import React, {useRef} from "react";
import {observer} from "mobx-react";
import {OptionsStrategyHeaderComponent} from "./options-strategy-header.component";
import {OptionsStrategyLegComponent} from "./options-strategy-leg.component";
import {OptionsStrategyFooterComponent} from "./options-strategy-footer.component";
import styled, {css} from "styled-components";
import {CardBox} from "../../../../framework/components/card/card.box";
import {IonIcon} from "@ionic/react";
import {informationOutline} from "ionicons/icons";
import {TooltipComponent} from "../../../../framework/components/tooltip/tooltip.component";
import {TooltipStandardContentBox} from "../../../../framework/components/tooltip/tooltip-standard-content.box";
import {useServices} from "../../../hooks/use-services.hook";
import {BestStrategyEnum} from "../../../services/strategy-settings/strategy-settings.service.interface";
import {NullableUndefinedBoolean} from "../../../../framework/types/nullable-types";
import {Check} from "../../../../framework/utils/type-checking";
import {
    BEST_POP,
    BEST_POP_AND_RR, BEST_POP_AND_RR_CONTRAST,
    BEST_POP_CONTRAST,
    BEST_RISK_REWARD,
    BEST_RISK_REWARD_CONTRAST
} from "./best-strategies-colors";

export const StrategyBox = styled(CardBox)<{$hasOppositePosition: boolean}>`
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--ion-space-8);
    padding: var(--ion-space-24);
    overflow: hidden;
    font-size: var(--ion-font-size-caption);
    ${props => props.theme.containerMediaQuery.smallScreen} {
        padding: var(--ion-space-20) var(--ion-space-16) var(--ion-space-16) var(--ion-space-20);
    }
    ${props => props.$hasOppositePosition && css`
        background-color: var(--ion-color-medium-tint);
    `}
`

const CornerBox = styled.div<{$isBestPop: boolean; $isBestRiskReward: boolean}>`
    --corner-size: 35px;
    ${props => props.theme.containerMediaQuery.smallScreen} {
        --corner-size: 30px;
    }
    position: absolute;
    width: 0;
    height: 0;
    top: -5px;
    left: -5px;
    border-left: var(--corner-size) solid transparent;
    border-right: var(--corner-size) solid transparent;
    transform: translateX(-25%) rotate(-45deg);

    ${props => props.$isBestPop && css`
        border-bottom: var(--corner-size) solid ${BEST_POP};
    `}
    ${props => props.$isBestRiskReward && css`
        border-bottom: var(--corner-size) solid ${BEST_RISK_REWARD};
    `}

    ${props => props.$isBestRiskReward && props.$isBestPop && css`
        border-bottom: var(--corner-size) solid ${BEST_POP_AND_RR};
    `}

   
`

const InfoIconBox = styled.div<{$isBestPop: boolean; $isBestRiskReward: boolean}>`
    position: absolute;
    top: 0;
    left: 0;
    transform: translateX(45%) translateY(45%);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    justify-items: center;
    font-size: 0.85rem;
    z-index: 100;
    border-radius: 50%;
    cursor: pointer;
    

    ${props => props.$isBestPop && css`
        color: ${BEST_POP_CONTRAST};
        border: 1px solid ${BEST_POP_CONTRAST};
    `}
    ${props => props.$isBestRiskReward && css`
        color: ${BEST_RISK_REWARD_CONTRAST};
        border: 1px solid ${BEST_RISK_REWARD_CONTRAST};
    `}

    ${props => props.$isBestRiskReward && props.$isBestPop && css`
        color: ${BEST_POP_AND_RR_CONTRAST};
        border: 1px solid ${BEST_POP_AND_RR_CONTRAST};
    `}
`

const BestStrategyTooltipContentBox = styled(TooltipStandardContentBox)<{$isBestPop: boolean; $isBestRiskReward: boolean}>`
    overflow: hidden;
    border-radius: var(--ion-border-radius);
    ${props => props.$isBestPop && css`
        background-color: ${BEST_POP};
        color: ${BEST_POP_CONTRAST};
        
    `}
    ${props => props.$isBestRiskReward && css`
        background-color: ${BEST_RISK_REWARD};
        color: ${BEST_RISK_REWARD_CONTRAST};
    `}

    ${props => props.$isBestRiskReward && props.$isBestPop && css`
        background-color: ${BEST_POP_AND_RR};
        color: ${BEST_POP_AND_RR_CONTRAST};
    `}
`


export interface OptionsStrategyComponentProps {
    strategy: IOptionsStrategyWithAnnotationsViewModel<IOptionsStrategyViewModel>;
    className?: string;
}
export const OptionsStrategyComponent: React.FC<OptionsStrategyComponentProps> = observer(props => {
    const services = useServices();
    const filters = services.strategySettings.strategyFilters;
    const infoIconBoxRef = useRef<HTMLDivElement | null>(null);
    const isBestRiskReward = props.strategy.isBestRiskReward;
    const isBestPop = props.strategy.isBestPOP;
    const hasOppositePosition = props.strategy.strategy.legs.some(l => l.hasOppositePositions);

    let shouldBeIncluded: NullableUndefinedBoolean = null;
    if(filters.bestStrategy.includes(BestStrategyEnum.BestPOP)) {
        shouldBeIncluded = isBestPop
    }
    if(filters.bestStrategy.includes(BestStrategyEnum.BestRiskReward)) {
        shouldBeIncluded = shouldBeIncluded || isBestRiskReward;
    }

    if(Check.isNullOrUndefined(shouldBeIncluded)) {
        shouldBeIncluded = true;
    }


    if(!shouldBeIncluded) {
        return null;
    }



    const renderCorner = () => {
        if(!(isBestPop || isBestRiskReward)) {
            return null;
        }
        return (
            <>
                <CornerBox $isBestRiskReward={isBestRiskReward} $isBestPop={isBestPop}/>
                <InfoIconBox $isBestRiskReward={isBestRiskReward} $isBestPop={isBestPop} ref={infoIconBoxRef}>
                    <IonIcon icon={informationOutline}/>
                </InfoIconBox>
            </>
        )
    }

    const renderToolTip = () => {
        if(!(isBestPop || isBestRiskReward)) {
            return null;
        }

        let tooltipText = '';

        if(isBestPop && isBestRiskReward) {
            tooltipText = services.language.translate('Best risk/reward and best POP');
        } else if(isBestPop) {
            tooltipText = services.language.translate('Best POP');
        } else if(isBestRiskReward) {
            tooltipText = services.language.translate('Best risk/reward');
        }

        return (
            <TooltipComponent targetRef={infoIconBoxRef}>
                <BestStrategyTooltipContentBox $isBestPop={isBestPop} $isBestRiskReward={isBestRiskReward}>
                    {tooltipText}
                </BestStrategyTooltipContentBox>
            </TooltipComponent>
        )
    }

    return (
        <>
            <StrategyBox $hasOppositePosition={hasOppositePosition}
                         className={props.className}>
                {renderCorner()}

                <OptionsStrategyHeaderComponent/>
                {props.strategy.strategy.legs.map(leg => (<OptionsStrategyLegComponent key={leg.key} leg={leg} strategy={props.strategy.strategy}/>))}
                <OptionsStrategyFooterComponent strategy={props.strategy.strategy}/>
            </StrategyBox>
            {renderToolTip()}
        </>

    )
})