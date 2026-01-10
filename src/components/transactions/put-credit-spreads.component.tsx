import React from "react";
import {observer} from "mobx-react";
import {ITickerViewModel} from "../../models/ticker.view-model.interface";
import {IonAccordionGroup} from "@ionic/react";
import {IOptionsExpirationVewModel} from "../../models/options-expiration.view-model.interface";
import {ExpirationStrategiesComponent} from "./expiration-strategies.component";
import {NoOptionsStrategyAvailableBox} from "./boxes/no-options-strategy-available.box";
import {
    EarningsDateMarkerAfterExpirationComponent,
    EarningsDateMarkerBeforeExpirationComponent
} from "../earnings-date-marker.component";
import {EarningsDatePositionEnum, getEarningsDateRenderPosition} from "./helper-functions";
import {OptionsStrategyComponent} from "./options-strategy.component";



const ExpirationPutCreditSpreadsComponent: React.FC<{ticker: ITickerViewModel; expiration: IOptionsExpirationVewModel; earningsDatePosition: EarningsDatePositionEnum}> = observer((props) => {

    const putCreditSpreads = props.expiration.putCreditSpreads;
    const bestPop = Math.max(...putCreditSpreads.map(condor => condor.pop));
    const bestRiskReward = Math.min(...putCreditSpreads.map(condor => condor.riskRewardRatio));
    return (
        <React.Fragment>
            <EarningsDateMarkerBeforeExpirationComponent ticker={props.ticker} position={props.earningsDatePosition}/>
            <ExpirationStrategiesComponent expiration={props.expiration} transactionsCount={putCreditSpreads.length}>
                {putCreditSpreads.map(putCreditSpread => <OptionsStrategyComponent key={putCreditSpread.key} strategy={putCreditSpread}
                                                                                                                                  bestPop={bestPop}
                                                                                                                                  bestRiskReward={bestRiskReward}/>)}
            </ExpirationStrategiesComponent>
            <EarningsDateMarkerAfterExpirationComponent ticker={props.ticker} position={props.earningsDatePosition}/>
        </React.Fragment>
    );

});


export const PutCreditSpreadsComponent: React.FC<{ticker: ITickerViewModel}> = observer((props) => {
    const expirations = props.ticker.getExpirationsWithPutCreditSpreads()
    if(expirations.length === 0) {
        return (
            <NoOptionsStrategyAvailableBox>
                No put credit spreads available
            </NoOptionsStrategyAvailableBox>
        );
    }

    return  (
        <IonAccordionGroup>
            {expirations.map((expiration, index) => <ExpirationPutCreditSpreadsComponent key={expiration.key}
                                                                                         expiration={expiration} ticker={props.ticker}
                                                                                         earningsDatePosition={getEarningsDateRenderPosition(props.ticker, expirations, index)}/>)}
        </IonAccordionGroup>
    )
})