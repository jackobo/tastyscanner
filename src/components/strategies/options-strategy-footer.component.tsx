import React from "react";
import {observer} from "mobx-react-lite";
import styled from "styled-components";
import {IOptionsStrategyViewModel} from "../../models/options-strategy.view-model.interface";
import {IonButton} from "@ionic/react";
import {SendOrderDialogComponent} from "./send-order-dialog.component";

const StrategyFooterBox = styled.div`
    display: grid;
    grid-template-columns: 1fr 0.5fr 1fr 1fr;
    row-gap: 8px;
    column-gap: 16px;
    font-weight: bold;
`

const ButtonBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    grid-column: 1 / -1;
`


export const OptionsStrategyFooterComponent: React.FC<{strategy: IOptionsStrategyViewModel; onOpenTradeDialog: () => void}> = observer((props) => {

    return (
        <StrategyFooterBox>
            <span>Risk/Reward:</span>
            <span>{props.strategy.riskRewardRatio}</span>
            <span>POP:</span>
            <span>{`${props.strategy.pop}%`}</span>
            <span>Wings:</span>
            <span>{`${props.strategy.wingsWidth}$`}</span>
            <span>Credit:</span>
            <span>{`${props.strategy.credit.toFixed(2)}$`}</span>
            <ButtonBox>
                <IonButton color={"success"} onClick={() => props.onOpenTradeDialog()}>
                    Trade
                </IonButton>
            </ButtonBox>

        </StrategyFooterBox>
    )
})