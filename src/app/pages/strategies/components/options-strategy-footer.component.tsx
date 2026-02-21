import React from "react";
import {observer} from "mobx-react-lite";
import styled from "styled-components";
import {IOptionsStrategyViewModel} from "../../../models/options-strategy.view-model.interface";
import {useServices} from "../../../hooks/use-services.hook";
import {SendOrderDialogComponent} from "./send-order/send-order-dialog.component";
import {DialogCloseButtonBehavior} from "../../../../framework/services/dialog/dialog-enums";
import {SuccessButton} from "../../../../framework/components/buttons/success-button";


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


export const OptionsStrategyFooterComponent: React.FC<{strategy: IOptionsStrategyViewModel}> = observer((props) => {
    const services = useServices();
    const onTrade = async () => {
        await services.dialog.showStandardDialog({
            closeButtonBehavior: DialogCloseButtonBehavior.Reject,
            render: dialogHandler => (<SendOrderDialogComponent dialogHandler={dialogHandler} strategy={props.strategy}/>)
        })
    }

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
            <span>Delta:</span>
            <span>{props.strategy.delta}</span>
            <span>Theta:</span>
            <span>{props.strategy.theta}</span>
            <ButtonBox>
                <SuccessButton onClick={onTrade}>
                    { services.language.translate("Trade")}
                </SuccessButton>
            </ButtonBox>

        </StrategyFooterBox>
    )
})