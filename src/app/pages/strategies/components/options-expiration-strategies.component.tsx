import React, {useRef} from "react";
import {observer} from "mobx-react";
import {
    IOptionsExpirationVewModel,
    OptionExpirationTypeEnum
} from "../../../models/options-expiration.view-model.interface";
import {ITickerViewModel} from "../../../models/ticker/ticker.view-model.interface";
import {EarningsDatePositionEnum} from "./helper-functions";
import {
    IOptionsStrategyViewModel,
    IOptionsStrategyWithAnnotationsViewModel
} from "../../../models/options-strategy.view-model.interface";
import {
    EarningsDateMarkerAfterExpirationComponent,
    EarningsDateMarkerBeforeExpirationComponent
} from "../../../components/ticker/earnings-date-marker.component";
import {OptionsStrategyComponent} from "./options-strategy.component";
import {IonAccordion, IonChip, IonItem} from "@ionic/react";
import styled, {css} from "styled-components";
import {useServices} from "../../../hooks/use-services.hook";
import {TooltipComponent} from "../../../../framework/components/tooltip/tooltip.component";
import {TooltipStandardContentBox} from "../../../../framework/components/tooltip/tooltip-standard-content.box";

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
    ${props => props.theme.containerMediaQuery.smallScreen} {
        --padding-start: 0;
        --padding-end: 0;
    }
    ${props => computeHeaderColor(props.$expirationType)}
`
const ExpirationHeaderItemContentBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--ion-space-20);
    width: 100%;
    ${props => props.theme.containerMediaQuery.smallScreen} {
        gap: var(--ion-space-8);
    }
     
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
    gap: var(--ion-space-16);
    padding: var(--ion-space-16) 0;
    justify-content: center;
`

const ExpirationDetailsBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--ion-space-8);
    ${props => props.theme.containerMediaQuery.smallScreen} {
        flex-direction: column;
        align-items: start;
        gap: 4px;
    }
    
`

interface OptionsExpirationStrategiesComponentProps {
    ticker: ITickerViewModel;
    expiration: IOptionsExpirationVewModel;
    strategies: IOptionsStrategyWithAnnotationsViewModel<IOptionsStrategyViewModel>[];
    earningsDatePosition: EarningsDatePositionEnum;
}
export const OptionsExpirationStrategiesComponent: React.FC<OptionsExpirationStrategiesComponentProps> = observer((props) => {
    const services = useServices();
    const strategiesCountRef = useRef<HTMLIonChipElement | null>(null)
    const activePositionsCountRef = useRef<HTMLDivElement | null>(null);

    const strategies = props.strategies;


    const renderExpirationDetails = () => {
        return (
            <ExpirationDetailsBox>
                <span>
                    {`${services.time.formatUserFriendlyMonthDay(props.expiration.expirationDate)} (${props.expiration.daysToExpiration}d)`}
                </span>
                <span>
                    {props.expiration.expirationType + (props.expiration.settlementType === 'AM' ? ' [AM]' : '')}
                </span>
            </ExpirationDetailsBox>
        )
    }

    const renderActivePositions = () => {
        const activePositions = services.brokers.currentAccount?.getActivePositionForSymbolAndExpiration(props.ticker.symbol, props.expiration.daysToExpiration);
        const positionsCount = (activePositions ?? []).length;

        if (positionsCount === 0) {
            return null;
        }

        return (
            <>
                <ActivePositionsCountBox ref={activePositionsCountRef}>
                    <span>
                        {services.language.translate('Active positions:')}
                    </span>
                    <span style={{fontWeight: "bold"}}>
                        {positionsCount}
                    </span>
                </ActivePositionsCountBox>

                <TooltipComponent targetRef={activePositionsCountRef}>
                    <TooltipStandardContentBox>
                        {services.language.translate('The number of active positions that are already open for this expiration according to your filters.')}
                    </TooltipStandardContentBox>
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
                        <TooltipComponent targetRef={strategiesCountRef}>
                            <TooltipStandardContentBox>
                                {services.language.translate('The number of strategies that are available for this expiration.')}
                            </TooltipStandardContentBox>
                        </TooltipComponent>
                        <ExpirationHeaderTitleBox>
                            {renderExpirationDetails()}
                        </ExpirationHeaderTitleBox>
                        {renderActivePositions()}

                    </ExpirationHeaderItemContentBox>
                </ExpirationHeaderItemBox>

                <StrategiesBox slot="content">
                    {strategies.map(condor => (<OptionsStrategyComponent key={condor.strategy.key}
                                                                         strategy={condor}/>))}
                </StrategiesBox>


            </IonAccordion>


            <EarningsDateMarkerAfterExpirationComponent ticker={props.ticker} position={props.earningsDatePosition}/>

        </React.Fragment>

    );
})