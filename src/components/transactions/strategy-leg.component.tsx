import React from "react";
import {observer} from "mobx-react";
import {IOptionViewModel} from "../../models/option.view-model.interface";
import styled from "styled-components";
import {StrategyLegBaseBox} from "./boxes/strategy-leg-base.box";

const OptionPriceBox = styled.span`
    text-align: right;
`

const StrikePriceBox = styled.span`
    text-align: center;
    width: 100%;
`


const StrategyLegBox = styled(StrategyLegBaseBox)<{$isSell: boolean}>`
    background-color: ${props => props.$isSell ? 'var(--ion-color-danger)' : 'var(--ion-color-success)'};
    color: ${props => props.$isSell ? 'var(--ion-color-danger-contrast)' : 'var(--ion-color-success-contrast)'};
`

export const StrategyLegComponent: React.FC<{option: IOptionViewModel; isSellOption: boolean}> = observer((props) => {
    const price = props.isSellOption ? props.option.lastPrice : -1 * props.option.lastPrice

    return (
        <StrategyLegBox $isSell={props.isSellOption}>
            <span>{props.isSellOption ? "STO" : "BTO"}</span>
            <span>{props.option.optionType}</span>
            <StrikePriceBox>{props.option.strikePrice}</StrikePriceBox>
            <OptionPriceBox>{`${price.toFixed(2)}$`}</OptionPriceBox>
            <span>{props.option.delta + '\u0394'}</span>
            <span>{props.option.bidAskSpread.toFixed(2) + '%'}</span>
        </StrategyLegBox>
    )
})
