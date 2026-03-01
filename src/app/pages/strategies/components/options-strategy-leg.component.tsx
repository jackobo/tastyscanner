import React, {useRef} from "react";
import {observer} from "mobx-react";
import styled, {css} from "styled-components";
import {OptionsStrategyLegBaseBox} from "./boxes/options-strategy-leg-base.box";
import {IOptionsStrategyLegViewModel} from "../../../models/options-strategy-leg.view-model.interface";
import {DELTA_SYMBOL} from "../../../utils/global-constants";
import {TooltipComponent, TooltipToggleBehaviorEnum} from "../../../../framework/components/tooltip/tooltip.component";
import {useServices} from "../../../hooks/use-services.hook";


const OptionPriceBox = styled.span`
    text-align: right;
`

const StrikePriceBox = styled.span`
    text-align: center;
    width: 100%;
`


const StrategyLegBox = styled(OptionsStrategyLegBaseBox)<{$isSell: boolean; $hasOppositePosition: boolean}>`
    position: relative;
    background-color: ${props => props.$isSell ? 'var(--ion-color-danger)' : 'var(--ion-color-success)'};
    color: ${props => props.$isSell ? 'var(--ion-color-danger-contrast)' : 'var(--ion-color-success-contrast)'};
    padding: var(--ion-space-8);
    ${props => props.$hasOppositePosition && css`
        opacity: 0.3;
    `}
    
`

const TooltipContentBox = styled.div`
    padding: var(--ion-space-16);
    font-size: var(--ion-font-size-body2);
    max-width: 300px;
`


const SameDirectionExistingPositionCountBox = styled.span`
    position: absolute;
    left: 0;
    top: 25%;
    transform: translateX(calc(-100% - 4px));
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    justify-items: center;
    background-color: var(--ion-color-warning);
    color: var(--ion-color-warning-contrast);
    border-radius: 50%;
    padding: 0.5rem;
    width: 1rem;
    height: 1rem;
    font-size: 0.7rem;
    font-weight: var(--ion-font-weight-bold);
    cursor: pointer;
`



export const OptionsStrategyLegComponent: React.FC<{leg: IOptionsStrategyLegViewModel}> = observer((props) => {
    const services = useServices();
    const strategyLegBoxRef = useRef<HTMLDivElement | null>(null)
    const sameDirectionPositionsCountRef = useRef<HTMLDivElement | null>(null);

    const isSellOption = props.leg.isSell;
    const hasOppositePosition = props.leg.hasOppositePositions;
    const sameDirectionPositionsCount = props.leg.countExistingSameDirectionPositions;

    const price = isSellOption ? props.leg.option.midPrice : -1 * props.leg.option.midPrice;

    const renderOppositePositionTooltip = () => {
        if(!hasOppositePosition) {
            return null;
        }

        let tooltipText: string;
        if(isSellOption) {
            tooltipText = services.language.translate('This leg has already am existing opposite buy order. Trading this strategy would close this leg.');
        } else {
            tooltipText = services.language.translate('This leg has already an existing opposite sell order. Trading this strategy would close this leg.');
        }

        return (
            <TooltipComponent targetRef={strategyLegBoxRef} placement={"bottom"} toggleBehavior={TooltipToggleBehaviorEnum.OnTargetMouseEnterLeave}>
                <TooltipContentBox>
                    {tooltipText}
                </TooltipContentBox>
            </TooltipComponent>
        )
    }

    const renderSameDirectionExistingPositionCount = () => {
        if(sameDirectionPositionsCount === 0) {
            return null;
        }
        return (
            <SameDirectionExistingPositionCountBox ref={sameDirectionPositionsCountRef}>
                {sameDirectionPositionsCount}
            </SameDirectionExistingPositionCountBox>
        );
    }

    const renderSameDirectionExistingPositionCountTooltip = () => {

        if(sameDirectionPositionsCount === 0) {
            return null;
        }

        let tooltipText: string;
        if(sameDirectionPositionsCount ===  1) {
            tooltipText = services.language.translate('You already have 1 open position on this leg. You can still trade this strategy but this will increase the number of positions on this leg.');
        } else {
            tooltipText = services.language.translationFor('You already have {count} open positions on this leg. You can still trade this strategy but this will increase the number of positions on this leg.').withParams({count: sameDirectionPositionsCount});
        }

        return (
            <TooltipComponent targetRef={sameDirectionPositionsCountRef} placement={"bottom"} toggleBehavior={TooltipToggleBehaviorEnum.OnTargetMouseEnterLeave}>
                <TooltipContentBox>
                    {tooltipText}
                </TooltipContentBox>
            </TooltipComponent>
        )
    }

    return (
        <>
            <StrategyLegBox $isSell={isSellOption} $hasOppositePosition={hasOppositePosition} ref={strategyLegBoxRef}>
                {renderSameDirectionExistingPositionCount()}
                <span>{props.leg.legActionType}</span>
                <span>{props.leg.option.optionType}</span>
                <StrikePriceBox>{props.leg.option.strikePrice}</StrikePriceBox>
                <OptionPriceBox>{`${price.toFixed(2)}$`}</OptionPriceBox>
                <span>{props.leg.option.deltaPercent + DELTA_SYMBOL}</span>
                <span>{props.leg.option.bidAskSpread.toFixed(2) + '%'}</span>
            </StrategyLegBox>
            {renderOppositePositionTooltip()}
            {renderSameDirectionExistingPositionCountTooltip()}

        </>
    )
})
