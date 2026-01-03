import React from "react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {TransactionLegBaseBox} from "./boxes/transaction-leg-base.box";

const TransactionHeaderBox = styled(TransactionLegBaseBox)`
    background-color: var(--ion-color-medium);
    color: var(--ion-color-medium-contrast);
`


export const TransactionHeaderComponent: React.FC = observer(() => {
    return (
        <TransactionHeaderBox>
            <span></span>
            <span></span>
            <span>strike</span>
            <span>last</span>
            <span>{'\u0394'}</span>
            <span>spread</span>
        </TransactionHeaderBox>
    )
})