import React from "react";
import {observer} from "mobx-react";
import {ITickerViewModel} from "../../models/ticker.view-model.interface";
import {IonAccordionGroup, IonCard} from "@ionic/react";
import {IOptionsExpirationVewModel} from "../../models/options-expiration.view-model.interface";
import {ExpirationStrategiesComponent} from "./expiration-strategies.component";
import {NoOptionsStrategyAvailableBox} from "./boxes/no-options-strategy-available.box";
import {
    EarningsDateMarkerAfterExpirationComponent,
    EarningsDateMarkerBeforeExpirationComponent
} from "../earnings-date-marker.component";
import {EarningsDatePositionEnum, getEarningsDateRenderPosition} from "./helper-functions";
import {OptionsStrategyComponent} from "./options-strategy.component";


const ExpirationCallCreditSpreadsComponent: React.FC<{ticker: ITickerViewModel; expiration: IOptionsExpirationVewModel; earningsDatePosition: EarningsDatePositionEnum}> = observer((props) => {

    const callCreditSpreads = props.expiration.callCreditSpreads;
    const bestPop = Math.max(...callCreditSpreads.map(condor => condor.pop));
    const bestRiskReward = Math.min(...callCreditSpreads.map(condor => condor.riskRewardRatio));
    return (
        <React.Fragment>
            <EarningsDateMarkerBeforeExpirationComponent ticker={props.ticker} position={props.earningsDatePosition}/>
            <ExpirationStrategiesComponent expiration={props.expiration} transactionsCount={callCreditSpreads.length}>
                {callCreditSpreads.map(callCreditSpread => (<OptionsStrategyComponent key={callCreditSpread.key}
                                                                                                          strategy={callCreditSpread}
                                                                                                          bestPop={bestPop} bestRiskReward={bestRiskReward}/>))}
            </ExpirationStrategiesComponent>
            <EarningsDateMarkerAfterExpirationComponent ticker={props.ticker} position={props.earningsDatePosition}/>
        </React.Fragment>
    );
});


export const CallCreditSpreadsComponent: React.FC<{ticker: ITickerViewModel}> = observer((props) => {
    const expirations = props.ticker.getExpirationsWithCallCreditSpreads()
    if(expirations.length === 0) {
        return (
            <NoOptionsStrategyAvailableBox>
                No call credit spreads available
            </NoOptionsStrategyAvailableBox>
        );
    }

    return  (
        <IonAccordionGroup>
            {expirations.map((expiration, index) => <ExpirationCallCreditSpreadsComponent key={expiration.key}
                                                                                         expiration={expiration} ticker={props.ticker}
                                                                                         earningsDatePosition={getEarningsDateRenderPosition(props.ticker, expirations, index)}/>)}
        </IonAccordionGroup>
    )
})