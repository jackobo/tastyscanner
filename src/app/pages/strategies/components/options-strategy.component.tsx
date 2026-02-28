import {IOptionsStrategyViewModel} from "../../../models/options-strategy.view-model.interface";
import React, {useRef} from "react";
import {observer} from "mobx-react";
import {OptionsStrategyHeaderComponent} from "./options-strategy-header.component";
import {OptionsStrategyLegComponent} from "./options-strategy-leg.component";
import {OptionsStrategyFooterComponent} from "./options-strategy-footer.component";
import styled, {css} from "styled-components";
import {CardBox} from "../../../../framework/components/card/card.box";
import {IonIcon} from "@ionic/react";
import {informationOutline} from "ionicons/icons";
import {TooltipComponent, TooltipToggleBehaviorEnum} from "../../../../framework/components/tooltip/tooltip.component";

export const StrategyBox = styled(CardBox)<{$isBestPop: boolean; $isBestRiskReward: boolean}>`
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 24px;
    overflow: hidden;
    font-size: var(--ion-font-size-body2);
`

const CornerBox = styled.div<{$isBestPop: boolean; $isBestRiskReward: boolean}>`
    position: absolute;
    width: 0;
    height: 0;
    top: -5px;
    left: -5px;
    border-left: 35px solid transparent;
    border-right: 35px solid transparent;
    transform: translateX(-25%) rotate(-45deg);

    ${props => props.$isBestPop && css`
        border-bottom: 35px solid var(--ion-color-warning-tint);
    `}
    ${props => props.$isBestRiskReward && css`
        border-bottom: 35px solid var(--ion-color-primary-tint);
    `}

    ${props => props.$isBestRiskReward && props.$isBestPop && css`
        border-bottom: 35px solid var(--ion-color-tertiary-tint);
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
    font-size: 14px;
    z-index: 100;
    border-radius: 50%;
    cursor: pointer;
    

    ${props => props.$isBestPop && css`
        color: var(--ion-color-warning-contrast);
        border: 1px solid var(--ion-color-warning-contrast);
    `}
    ${props => props.$isBestRiskReward && css`
        color: var(--ion-color-primary-contrast);
        border: 1px solid var(--ion-color-primary-contrast);
    `}

    ${props => props.$isBestRiskReward && props.$isBestPop && css`
        color: var(--ion-color-tertiary-contrast);
        border: 1px solid var(--ion-color-tertiary-contrast);
    `}
`

const ToolTipContentBox = styled.div`
    padding: var(--ion-space-16);
    font-size: var(--ion-font-size-body2);
`



export interface OptionsStrategyComponentProps {
    strategy: IOptionsStrategyViewModel;
    bestPop: number;
    bestRiskReward: number;
    className?: string;
}
export const OptionsStrategyComponent: React.FC<OptionsStrategyComponentProps> = observer(props => {
    const infoIconBoxRef = useRef<HTMLDivElement | null>(null);
    const isBestRiskReward = props.strategy.riskRewardRatio === props.bestRiskReward;
    const isBestPop = props.strategy.pop === props.bestPop;

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
            tooltipText = 'Best risk/reward and best POP';
        } else if(isBestPop) {
            tooltipText = 'Best POP';
        } else if(isBestRiskReward) {
            tooltipText = 'Best risk/reward';
        }

        return (
            <TooltipComponent targetRef={infoIconBoxRef} placement={"bottom"} toggleBehavior={TooltipToggleBehaviorEnum.OnTargetMouseEnterLeave}>
                <ToolTipContentBox>
                    {tooltipText}
                </ToolTipContentBox>
            </TooltipComponent>
        )
    }

    return (
        <>
            <StrategyBox $isBestRiskReward={isBestRiskReward}
                         $isBestPop={isBestPop}
                         className={props.className}>
                {renderCorner()}

                <OptionsStrategyHeaderComponent/>
                {props.strategy.legs.map(leg => (<OptionsStrategyLegComponent key={leg.key} leg={leg}/>))}
                <OptionsStrategyFooterComponent strategy={props.strategy}/>
            </StrategyBox>
            {renderToolTip()}
        </>

    )
})