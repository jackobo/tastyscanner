import React, {useRef} from "react";
import {observer} from "mobx-react-lite";
import styled from "styled-components";
import {IOptionsStrategyViewModel} from "../../../models/options-strategy.view-model.interface";
import {useServices} from "../../../hooks/use-services.hook";
import {SendOrderDialogComponent} from "./send-order/send-order-dialog.component";
import {DialogCloseButtonBehavior} from "../../../../framework/services/dialog/dialog-enums";
import {SuccessButton} from "../../../../framework/components/buttons/success-button";
import {ButtonTooltipProps} from "../../../../framework/components/buttons/button-base";
import {IonIcon} from "@ionic/react";
import {informationCircleOutline} from "ionicons/icons";
import {TooltipComponent} from "../../../../framework/components/tooltip/tooltip.component";
import {TooltipStandardContentBox} from "../../../../framework/components/tooltip/tooltip-standard-content.box";


const StrategyFooterBox = styled.div`
    display: grid;
    grid-template-columns: repeat(4, auto);
    column-gap: 4px;
    row-gap: 8px;
    font-weight: bold;
`


const ButtonBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    grid-column: 1 / -1;
    margin-top: var(--ion-space-8);
`

const LabelWithTooltipBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
`

const InfoCircleBox = styled.span`
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 16px;
    cursor: pointer;
`

const ValueBox = styled.span`
    text-align: right;
`


const LabelWithTooltipComponent: React.FC<{label: string, tooltipText: string | React.ReactElement }> = observer((props) => {

    const infoCircleBoxRef = useRef<HTMLSpanElement>(null);
    return (
        <LabelWithTooltipBox>
            <span>{props.label}</span>
            <InfoCircleBox ref={infoCircleBoxRef}>
                <IonIcon icon={informationCircleOutline}/>
            </InfoCircleBox>
            <TooltipComponent targetRef={infoCircleBoxRef}>
                <TooltipStandardContentBox>
                    {props.tooltipText}
                </TooltipStandardContentBox>

            </TooltipComponent>
        </LabelWithTooltipBox>
    )
})

export const OptionsStrategyFooterComponent: React.FC<{strategy: IOptionsStrategyViewModel}> = observer((props) => {
    const services = useServices();
    const onTrade = async () => {
        await services.dialog.showStandardDialog({
            closeButtonBehavior: DialogCloseButtonBehavior.Reject,
            render: dialogHandler => (<SendOrderDialogComponent dialogHandler={dialogHandler} strategy={props.strategy}/>)
        })
    }

    const hasOppositePosition = props.strategy.legs.some(l => l.hasOppositePositions);

    const getButtonTooltipProps = (): ButtonTooltipProps | undefined => {
        if(!hasOppositePosition) {
            return undefined;
        }

        return {
            renderTooltipContent: () => services.language.translate("Some of the legs in this strategy have opposite positions in already active/working orders.")
        }
    }

    const renderShortLegsDeltaTooltip = () => {
        return (
            <>
                <div>
                    {services.language.translate("Is the delta computed only for the short legs.")}
                </div>
                <div>
                    {services.language.translate("For an Iron Condor this is:")}
                </div>
                <div>
                    |SoldPutDelta| - |SoldCallDelta|
                </div>
            </>
        )
    }

    return (
        <StrategyFooterBox>
            <span>Risk/Reward:</span>
            <ValueBox>{props.strategy.riskRewardRatio}</ValueBox>
            <span>POP:</span>
            <ValueBox>{`${props.strategy.pop}%`}</ValueBox>
            <span>Wings:</span>
            <ValueBox>{`${props.strategy.wingsWidth}$`}</ValueBox>
            <span>Credit:</span>
            <ValueBox>{`${props.strategy.credit.toFixed(2)}$`}</ValueBox>
            <LabelWithTooltipComponent label={"Delta:"}
                                       tooltipText={services.language.translate("Total delta for the strategy.")}/>
            <ValueBox>{props.strategy.delta}</ValueBox>
            <LabelWithTooltipComponent label={`Short legs delta:`} tooltipText={renderShortLegsDeltaTooltip()}/>
            <ValueBox>{props.strategy.shortLegsDelta}</ValueBox>
            <ButtonBox>
                <SuccessButton onClick={onTrade} disabled={hasOppositePosition} tooltip={getButtonTooltipProps()}>
                    { services.language.translate("Trade")}
                </SuccessButton>
            </ButtonBox>

        </StrategyFooterBox>
    )
})