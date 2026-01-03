import React from "react";
import {observer} from "mobx-react-lite";
import styled from "styled-components";
import {ITransactionViewModel} from "../../models/transaction.view-model.interface";

const TransactionFooterBox = styled.div`
    display: grid;
    grid-template-columns: 1fr 0.5fr 1fr 1fr;
    row-gap: 8px;
    column-gap: 16px;
    font-weight: bold;
    color: var(--ion-color-primary);
`


export const TransactionFooterComponent: React.FC<{transaction: ITransactionViewModel}> = observer((props) => {
    return (
        <TransactionFooterBox>
            <span>Risk/Reward:</span>
            <span>{props.transaction.riskRewardRatio}</span>
            <span>POP:</span>
            <span>{`${props.transaction.pop}%`}</span>
            <span>Wings:</span>
            <span>{`${props.transaction.wingsWidth}$`}</span>
            <span>Credit:</span>
            <span>{`${props.transaction.credit.toFixed(2)}$`}</span>
        </TransactionFooterBox>
    )
})