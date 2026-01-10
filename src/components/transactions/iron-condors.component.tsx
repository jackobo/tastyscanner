import React from 'react';
import {IOptionsExpirationVewModel} from "../../models/options-expiration.view-model.interface";
import {observer} from "mobx-react-lite";
import {IonAccordionGroup, IonCard} from '@ionic/react';
import {ExpirationStrategiesComponent} from "./expiration-strategies.component";
import {ITickerViewModel} from "../../models/ticker.view-model.interface";
import {NoOptionsStrategyAvailableBox} from "./boxes/no-options-strategy-available.box";
import {EarningsDatePositionEnum, getEarningsDateRenderPosition} from "./helper-functions";
import {
    EarningsDateMarkerAfterExpirationComponent,
    EarningsDateMarkerBeforeExpirationComponent,
} from "../earnings-date-marker.component";
import {OptionsStrategyComponent} from "./options-strategy.component";


const ExpirationIronCondorsComponent: React.FC<{expiration: IOptionsExpirationVewModel; ticker: ITickerViewModel; earningsDatePosition: EarningsDatePositionEnum}> = observer((props) => {

    const condors = props.expiration.ironCondors;
    const bestPop = Math.max(...condors.map(condor => condor.pop));
    const bestRiskReward = Math.min(...condors.map(condor => condor.riskRewardRatio));

    return (
        <React.Fragment>
            <EarningsDateMarkerBeforeExpirationComponent ticker={props.ticker} position={props.earningsDatePosition}/>
            <ExpirationStrategiesComponent expiration={props.expiration} transactionsCount={condors.length}>
                {condors.map(condor => (<OptionsStrategyComponent key={condor.key}
                                                                                      strategy={condor} bestPop={bestPop}
                                                                                      bestRiskReward={bestRiskReward}/>))}
            </ExpirationStrategiesComponent>
            <EarningsDateMarkerAfterExpirationComponent ticker={props.ticker} position={props.earningsDatePosition}/>
        </React.Fragment>

    );
});

export const IronCondorsComponent: React.FC<{ticker: ITickerViewModel}> = observer((props) => {


    const expirations = props.ticker.getExpirationsWithIronCondors()
    if(expirations.length === 0) {
        return (
            <NoOptionsStrategyAvailableBox>
                No iron condors available
            </NoOptionsStrategyAvailableBox>
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