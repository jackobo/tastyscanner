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


const StrategyLegBox = styled(OptionsStrategyLegBaseBox)<{$isSell: boolean; $hasOppositePurchases: boolean}>`
    background-color: ${props => props.$isSell ? 'var(--ion-color-danger)' : 'var(--ion-color-success)'};
    color: ${props => props.$isSell ? 'var(--ion-color-danger-contrast)' : 'var(--ion-color-success-contrast)'};
    padding: var(--ion-space-8);
    ${props => props.$hasOppositePurchases && css`
        opacity: 0.3;
    `}
    
`

const HasPurchasesTooltipContentBox = styled.div`
    padding: var(--ion-space-16);
    font-size: var(--ion-font-size-body2);
    max-width: 300px;
`

export const OptionsStrategyLegComponent: React.FC<{leg: IOptionsStrategyLegViewModel}> = observer((props) => {
    const services = useServices();
    const strategyLegBoxRef = useRef<HTMLDivElement | null>(null)
    const isSellOption = props.leg.isSell;
    const hasOppositePurchases = props.leg.hasOppositePurchases;


    const price = isSellOption ? props.leg.option.midPrice : -1 * props.leg.option.midPrice;

    const renderTooltip = () => {
        if(!hasOppositePurchases) {
            return null;
        }

        let tooltipText: string;
        if(isSellOption) {
            tooltipText = services.language.translate('This leg has already am existing buy order. Trading this strategy would close this leg.');
        } else {
            tooltipText = services.language.translate('This leg has already an existing sell order. Trading this strategy would close this leg.');
        }

        return (
            <TooltipComponent targetRef={strategyLegBoxRef} placement={"bottom"} toggleBehavior={TooltipToggleBehaviorEnum.OnTargetMouseEnterLeave}>
                <HasPurchasesTooltipContentBox>
                    {tooltipText}
                </HasPurchasesTooltipContentBox>
            </TooltipComponent>
        )
    }

    return (
        <>
            <StrategyLegBox $isSell={isSellOption} $hasOppositePurchases={hasOppositePurchases} ref={strategyLegBoxRef}>
                <span>{props.leg.legActionType}</span>
                <span>{props.leg.option.optionType}</span>
                <StrikePriceBox>{props.leg.option.strikePrice}</StrikePriceBox>
                <OptionPriceBox>{`${price.toFixed(2)}$`}</OptionPriceBox>
                <span>{props.leg.option.deltaPercent + DELTA_SYMBOL}</span>
                <span>{props.leg.option.bidAskSpread.toFixed(2) + '%'}</span>
            </StrategyLegBox>
            {renderTooltip()}
        </>
    )
})
