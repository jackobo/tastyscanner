import React, {useRef} from "react";
import {observer} from "mobx-react-lite";
import styled, {css} from "styled-components";
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
import {MathUtils} from "../../../../framework/utils/math-utils";

const FooterContainerBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--ion-space-16);
    width: 100%;
`


const StrategyPropertiesContainerBox = styled.div`
    display: grid;
    grid-template-columns: repeat(2, auto);
    border-top: 1px solid var(--ion-color-border);
    border-left: 1px solid var(--ion-color-border);
`

const CellBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`

const LabelBox = styled(CellBox)`
    
`

const ValueBox = styled(CellBox)`
    text-align: right;
    font-weight: var(--ion-font-weight-bold);
`

const PropertyBox = styled.div<{$fullWidth?: boolean}>`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 5px;
    border-right: 1px solid var(--ion-color-border);
    border-bottom: 1px solid var(--ion-color-border);
    ${props => props.$fullWidth && css`grid-column: 1/-1;`}
`


const LabelWithTooltipBox = styled(LabelBox)`
    gap: 4px;
`

const InfoCircleBox = styled.span`
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 16px;
    cursor: pointer;
`

const TradeButtonBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
`



const FooterPropertyComponent: React.FC<{label: string | React.ReactElement; value: string | React.ReactElement; fullWidth?: boolean}> = observer((props) => {
    return (
        <PropertyBox $fullWidth={props.fullWidth}>
            <LabelBox>
                {props.label}
            </LabelBox>
            <ValueBox>
                {props.value}
            </ValueBox>
        </PropertyBox>
    )
})


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

    const renderCredits = () => {
        if(props.strategy.credits.length === 0) {
            return null;
        }
        return (
            <>
                {props.strategy.credits.map((credit) => (
                    <FooterPropertyComponent key={credit.description} label={credit.description} value={credit.credit.toFixed(2)}/>
                ))}
            </>
        )
    }

    return (
        <FooterContainerBox>
            <StrategyPropertiesContainerBox>
                <FooterPropertyComponent label={services.language.translate("Wings")}
                                         value={`${props.strategy.wingsWidth}$`} fullWidth={true}/>

                <FooterPropertyComponent label={services.language.translate("Total Credit")}
                                         value={`${props.strategy.totalCredit.toFixed(2)}$`} fullWidth={true}/>

                {renderCredits()}
                <FooterPropertyComponent label={services.language.translate("Risk/Reward")}
                                         value={props.strategy.riskRewardRatio.toString()}/>

                <FooterPropertyComponent label={services.language.translate("POP")}
                                         value={`${MathUtils.round(props.strategy.pop, 0)}%`}/>
                <FooterPropertyComponent label={<LabelWithTooltipComponent label={"Delta"}
                                                                           tooltipText={services.language.translate("Total delta for the strategy.")}/>}
                                         value={props.strategy.delta.toFixed(2)}/>

                <FooterPropertyComponent label={<LabelWithTooltipComponent label={"Short legs delta"}
                                                                           tooltipText={renderShortLegsDeltaTooltip()}/>}
                                         value={props.strategy.shortLegsDelta.toFixed(2)}/>
            </StrategyPropertiesContainerBox>
            <TradeButtonBox>
                <SuccessButton onClick={onTrade} disabled={hasOppositePosition} tooltip={getButtonTooltipProps()}>
                    { services.language.translate("Trade")}
                </SuccessButton>
            </TradeButtonBox>
        </FooterContainerBox>

    )
})