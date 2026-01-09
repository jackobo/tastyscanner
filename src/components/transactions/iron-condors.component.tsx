import React from 'react';
import {IOptionsExpirationVewModel} from "../../models/options-expiration.view-model.interface";
import {observer} from "mobx-react-lite";
import {IIronCondorViewModel} from "../../models/iron-condor.view-model.interface";
import {IonAccordionGroup, IonCard} from '@ionic/react';
import {StrategyHeaderComponent} from "./strategy-header.component";
import {StrategyLegComponent} from "./strategy-leg.component";
import {StrategyFooterComponent} from "./strategy-footer.component";
import {ExpirationStrategiesComponent} from "./expiration-strategies.component";
import {StrategyBox} from "./boxes/strategy.box";
import {ITickerViewModel} from "../../models/ticker.view-model.interface";
import {NoStrategyAvailableBox} from "./boxes/no-strategy-available.box";
import {EarningsDatePositionEnum, getEarningsDateRenderPosition} from "./helper-functions";
import {
    EarningsDateMarkerAfterExpirationComponent,
    EarningsDateMarkerBeforeExpirationComponent,
} from "../earnings-date-marker.component";



const CondorComponent: React.FC<{condor: IIronCondorViewModel; bestPop: number; bestRiskReward: number}> = observer((props) => {
    return (
        <IonCard>
            <StrategyBox $isBestRiskReward={props.condor.riskRewardRatio === props.bestRiskReward}
                         $isBestPop={props.condor.pop === props.bestPop}>
                <StrategyHeaderComponent/>
                <StrategyLegComponent option={props.condor.btoPut} isSellOption={false}/>
                <StrategyLegComponent option={props.condor.stoPut} isSellOption={true}/>
                <StrategyLegComponent option={props.condor.stoCall} isSellOption={true}/>
                <StrategyLegComponent option={props.condor.btoCall} isSellOption={false}/>
                <StrategyFooterComponent transaction={props.condor}/>
            </StrategyBox>
        </IonCard>
    )
})

const ExpirationIronCondorsComponent: React.FC<{expiration: IOptionsExpirationVewModel; ticker: ITickerViewModel; earningsDatePosition: EarningsDatePositionEnum}> = observer((props) => {

    const condors = props.expiration.ironCondors;
    const bestPop = Math.max(...condors.map(condor => condor.pop));
    const bestRiskReward = Math.min(...condors.map(condor => condor.riskRewardRatio));

    return (
        <React.Fragment>
            <EarningsDateMarkerBeforeExpirationComponent ticker={props.ticker} position={props.earningsDatePosition}/>
            <ExpirationStrategiesComponent expiration={props.expiration} transactionsCount={condors.length}>
                {condors.map(condor => <CondorComponent key={condor.key} condor={condor} bestPop={bestPop} bestRiskReward={bestRiskReward}/>)}
            </ExpirationStrategiesComponent>
            <EarningsDateMarkerAfterExpirationComponent ticker={props.ticker} position={props.earningsDatePosition}/>
        </React.Fragment>

    );
});

export const IronCondorsComponent: React.FC<{ticker: ITickerViewModel}> = observer((props) => {


    const expirations = props.ticker.getExpirationsWithIronCondors()
    if(expirations.length === 0) {
        return (
            <NoStrategyAvailableBox>
                No iron condors available
            </NoStrategyAvailableBox>
        )
    }

    return  (
        <IonAccordionGroup>
            {expirations.map((expiration, index) => <ExpirationIronCondorsComponent key={expiration.key}
                                                                                    ticker={props.ticker}
                                                                                    expiration={expiration}
                                                                                    earningsDatePosition={getEarningsDateRenderPosition(props.ticker, expirations, index)}/>)}
        </IonAccordionGroup>
    )
})