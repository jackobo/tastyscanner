import React, {useRef} from "react";
import {observer} from "mobx-react";
import styled, {css} from "styled-components";
import {OptionsStrategyLegBaseBox} from "./boxes/options-strategy-leg-base.box";
import {IOptionsStrategyLegViewModel} from "../../../models/options-strategy-leg.view-model.interface";
import {DELTA_SYMBOL} from "../../../utils/global-constants";
import {TooltipComponent} from "../../../../framework/components/tooltip/tooltip.component";
import {useServices} from "../../../hooks/use-services.hook";
import {IOptionsStrategyViewModel} from "../../../models/options-strategy.view-model.interface";
import {TooltipStandardContentBox} from "../../../../framework/components/tooltip/tooltip-standard-content.box";


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

const RightAlignedValueBox = styled.span`
    text-align: right;
`

export const OptionsStrategyLegComponent: React.FC<{leg: IOptionsStrategyLegViewModel; strategy: IOptionsStrategyViewModel}> = observer((props) => {
    const services = useServices();
    const strategyLegBoxRef = useRef<HTMLDivElement | null>(null)
    const sameDirectionPositionsCountRef = useRef<HTMLDivElement | null>(null);

    const isSellOption = props.leg.isSell;
    const hasOppositePosition = props.leg.hasOppositePositions;
    const sameDirectionPositionsCount = props.leg.countExistingSameDirectionPositions;
    const strategyHasOppositePosition = props.strategy.legs.some(l => l.hasOppositePositions);

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
            <TooltipComponent targetRef={strategyLegBoxRef}>
                <TooltipStandardContentBox>
                    {tooltipText}
                </TooltipStandardContentBox>
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
        if(strategyHasOppositePosition) {
            if(sameDirectionPositionsCount ===  1) {
                tooltipText = services.language.translate('You already have 1 active/working position on this leg.');
            } else {
                tooltipText = services.language.translationFor('You already have {count} active/working positions on this leg.').withParams({count: sameDirectionPositionsCount});
            }
        } else {
            if(sameDirectionPositionsCount ===  1) {
                tooltipText = services.language.translate('You already have 1 active/working position on this leg. You can still trade this strategy but this will increase the number of positions on this leg.');
            } else {
                tooltipText = services.language.translationFor('You already have {count} active/working positions on this leg. You can still trade this strategy but this will increase the number of positions on this leg.').withParams({count: sameDirectionPositionsCount});
            }
        }


        return (
            <TooltipComponent targetRef={sameDirectionPositionsCountRef}>
                <TooltipStandardContentBox>
                    {tooltipText}
                </TooltipStandardContentBox>
            </TooltipComponent>
        )
    }

    return (
        <>
            <StrategyLegBox $isSell={isSellOption} $hasOppositePosition={hasOppositePosition} ref={strategyLegBoxRef}>
                {renderSameDirectionExistingPositionCount()}
                <span>{props.leg.legActionType}</span>
                <span>{props.leg.option.optionType}</span>
                <span>{services.time.formatUserFriendlyMonthDay(props.leg.option.expirationDate)}</span>
                <StrikePriceBox>{props.leg.option.strikePrice}</StrikePriceBox>
                <OptionPriceBox>{`${price.toFixed(2)}$`}</OptionPriceBox>
                <RightAlignedValueBox>{props.leg.option.deltaPercent.toFixed(2) + ' ' + DELTA_SYMBOL}</RightAlignedValueBox>
                <RightAlignedValueBox>{props.leg.option.bidAskSpread.toFixed(2) + '%'}</RightAlignedValueBox>
            </StrategyLegBox>
            {renderOppositePositionTooltip()}
            {renderSameDirectionExistingPositionCountTooltip()}

        </>
    )
})
