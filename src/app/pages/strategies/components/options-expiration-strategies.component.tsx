import React, {useRef} from "react";
import {observer} from "mobx-react";
import {
    IOptionsExpirationVewModel,
    OptionExpirationTypeEnum
} from "../../../models/options-expiration.view-model.interface";
import {ITickerViewModel} from "../../../models/ticker/ticker.view-model.interface";
import {EarningsDatePositionEnum} from "./helper-functions";
import {IOptionsStrategyViewModel} from "../../../models/options-strategy.view-model.interface";
import {
    EarningsDateMarkerAfterExpirationComponent,
    EarningsDateMarkerBeforeExpirationComponent
} from "../../../components/ticker/earnings-date-marker.component";
import {OptionsStrategyComponent} from "./options-strategy.component";
import {IonAccordion, IonChip, IonItem} from "@ionic/react";
import styled, {css} from "styled-components";
import {useServices} from "../../../hooks/use-services.hook";
import {TooltipComponent, TooltipToggleBehaviorEnum} from "../../../../framework/components/tooltip/tooltip.component";

function computeHeaderColor(expirationType: OptionExpirationTypeEnum) {
    switch (expirationType) {
        case OptionExpirationTypeEnum.Regular:
            return css`
                --background: var(--ion-color-light-shade);
                --color: var(--ion-color-light-contrast);
            `;
        case OptionExpirationTypeEnum.Quarterly:
        case OptionExpirationTypeEnum.EndOfMonth:
            return css`
                --background: var(--ion-color-medium-tint);
                --color: var(--ion-color-medium-contrast);
            `
        default:
            return css`
                --background: var(--ion-color-light);
                --color: var(--ion-color-light-contrast);
            `
    }
}

const ExpirationHeaderItemBox = styled(IonItem)<{ $expirationType: OptionExpirationTypeEnum}>`
    cursor: pointer;
    width: 100%;
    ${props =>computeHeaderColor(props.$expirationType)}
`
const ExpirationHeaderItemContentBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
    padding: 8px 16px;
    width: 100%;
     
`

const StrategiesCountBox = styled(IonChip)`
    --background: var(--ion-color-tertiary);
    --color: var(--ion-color-tertiary-contrast);
    min-width: 50px;
    text-align: center;
    justify-content: center;
    
`

const ExpirationHeaderTitleBox = styled.div`
    flex-grow: 1;
`

const ActivePositionsCountBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
`

const StrategiesBox = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--ion-space-30);
    padding: var(--ion-space-30);
    justify-content: center;
`

const InfoToolTipBox = styled.div`
    padding: var(--ion-space-16);
    max-width: 250px;
    font-size: var(--ion-font-size-body2);
`

interface OptionsExpirationStrategiesComponentProps {
    ticker: ITickerViewModel;
    expiration: IOptionsExpirationVewModel;
    strategies: IOptionsStrategyViewModel[];
    earningsDatePosition: EarningsDatePositionEnum;
}
export const OptionsExpirationStrategiesComponent: React.FC<OptionsExpirationStrategiesComponentProps> = observer((props) => {
    const services = useServices();
    const strategiesCountRef = useRef<HTMLIonChipElement | null>(null)
    const activePositionsCountRef = useRef<HTMLDivElement | null>(null);

    const strategies = props.strategies;
    const bestPop = Math.max(...strategies.map(strategy => strategy.pop));
    const bestRiskReward = Math.min(...strategies.map(strategy => strategy.riskRewardRatio));


    let label = `${props.expiration.expirationDate} (${props.expiration.daysToExpiration} days) - ${props.expiration.expirationType}`;
    if(props.expiration.settlementType === 'AM') {
        label +=  ` [${props.expiration.settlementType}]`
    }

    const renderActivePositions = () => {
        const activePositions = services.brokers.currentAccount?.activePositions;
        if (!activePositions) {
            return null;
        }
        const positionsCount = activePositions.positions
            .filter(p => p.underlyingSymbol == props.ticker.symbol
                && p.legs.some(l => l.daysToExpiration === props.expiration.daysToExpiration))
            .length;

        if (positionsCount === 0) {
            return null;
        }

        return (
            <>
                <ActivePositionsCountBox ref={activePositionsCountRef}>
                    <span>
                        {services.language.translate('Active positions:')}
                    </span>
                    <span>
                        {positionsCount}
                    </span>
                </ActivePositionsCountBox>

                <TooltipComponent targetRef={activePositionsCountRef} placement={"bottom"}
                                  toggleBehavior={TooltipToggleBehaviorEnum.OnTargetMouseEnterLeave}>
                    <InfoToolTipBox>
                        {services.language.translate('The number of active positions that are already open for this expiration.')}
                    </InfoToolTipBox>
                </TooltipComponent>
            </>
        )
    }

    return (
        <React.Fragment>
            <EarningsDateMarkerBeforeExpirationComponent ticker={props.ticker} position={props.earningsDatePosition}/>

            <IonAccordion value={props.expiration.key}>

                <ExpirationHeaderItemBox slot="header" $expirationType={props.expiration.expirationType}>
                    <ExpirationHeaderItemContentBox>
                        <StrategiesCountBox ref={strategiesCountRef}>
                            {strategies.length}
                        </StrategiesCountBox>
                        <TooltipComponent targetRef={strategiesCountRef} placement={"bottom"} toggleBehavior={TooltipToggleBehaviorEnum.OnTargetMouseEnterLeave}>
                            <InfoToolTipBox>
                                {services.language.translate('The number of strategies that are available for this expiration.')}
                            </InfoToolTipBox>
                        </TooltipComponent>
                        <ExpirationHeaderTitleBox>
                            {label}
                        </ExpirationHeaderTitleBox>
                        {renderActivePositions()}

                    </ExpirationHeaderItemContentBox>
                </ExpirationHeaderItemBox>

                <StrategiesBox slot="content">
                    {strategies.map(condor => (<OptionsStrategyComponent key={condor.key}
                                                                         strategy={condor} bestPop={bestPop}
                                                                         bestRiskReward={bestRiskReward}/>))}
                </StrategiesBox>


            </IonAccordion>


            <EarningsDateMarkerAfterExpirationComponent ticker={props.ticker} position={props.earningsDatePosition}/>

        </React.Fragment>

    );
})