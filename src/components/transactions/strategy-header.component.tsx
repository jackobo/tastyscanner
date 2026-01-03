import React from "react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {StrategyLegBaseBox} from "./boxes/strategy-leg-base.box";

const StrategyHeaderBox = styled(StrategyLegBaseBox)`
    background-color: var(--ion-color-medium);
    color: var(--ion-color-medium-contrast);
`


export const StrategyHeaderComponent: React.FC = observer(() => {
    return (
        <StrategyHeaderBox>
            <span></span>
            <span></span>
            <span>strike</span>
            <span>price</span>
            <span>{'\u0394'}</span>
            <span>spread</span>
        </StrategyHeaderBox>
    )
})