import React from "react";
import {observer} from "mobx-react";
import {ITickerViewModel} from "../../models/ticker.view-model.interface";
import {IonAccordionGroup, IonCard} from "@ionic/react";
import {IOptionsExpirationVewModel} from "../../models/options-expiration.view-model.interface";
import {ExpirationStrategiesComponent} from "./expiration-strategies.component";
import {StrategyBox} from "./boxes/strategy.box";
import {StrategyHeaderComponent} from "./strategy-header.component";
import {StrategyLegComponent} from "./strategy-leg.component";
import {StrategyFooterComponent} from "./strategy-footer.component";
import {ICreditSpreadViewModel} from "../../models/credit-spread.view-model.interface";
import {NoStrategyAvailableBox} from "./boxes/no-strategy-available.box";
import {
    EarningsDateMarkerAfterExpirationComponent,
    EarningsDateMarkerBeforeExpirationComponent
} from "../earnings-date-marker.component";
import {EarningsDatePositionEnum, getEarningsDateRenderPosition} from "./helper-functions";


const CallCreditSpreadComponent: React.FC<{callCreditSpread: ICreditSpreadViewModel; bestPop: number; bestRiskReward: number}> = observer((props) => {

    return (
        <IonCard>
            <StrategyBox $isBestRiskReward={props.callCreditSpread.riskRewardRatio === props.bestRiskReward}
                         $isBestPop={props.callCreditSpread.pop === props.bestPop}>
                <StrategyHeaderComponent/>
                <StrategyLegComponent option={props.callCreditSpread.stoOption} isSellOption={true}/>
                <StrategyLegComponent option={props.callCreditSpread.btoOption} isSellOption={false}/>
                <StrategyFooterComponent strategy={props.callCreditSpread}/>
            </StrategyBox>
        </IonCard>
    )
})

const ExpirationCallCreditSpreadsComponent: React.FC<{ticker: ITickerViewModel; expiration: IOptionsExpirationVewModel; earningsDatePosition: EarningsDatePositionEnum}> = observer((props) => {

    const callCreditSpreads = props.expiration.callCreditSpreads;
    const bestPop = Math.max(...callCreditSpreads.map(condor => condor.pop));
    const bestRiskReward = Math.min(...callCreditSpreads.map(condor => condor.riskRewardRatio));
    return (
        <React.Fragment>
            <EarningsDateMarkerBeforeExpirationComponent ticker={props.ticker} position={props.earningsDatePosition}/>
            <ExpirationStrategiesComponent expiration={props.expiration} transactionsCount={callCreditSpreads.length}>
                {callCreditSpreads.map(callCreditSpread => <CallCreditSpreadComponent key={callCreditSpread.key} callCreditSpread={callCreditSpread} bestPop={bestPop} bestRiskReward={bestRiskReward}/>)}
            </ExpirationStrategiesComponent>
            <EarningsDateMarkerAfterExpirationComponent ticker={props.ticker} position={props.earningsDatePosition}/>
        </React.Fragment>
    );
});


export const CallCreditSpreadsComponent: React.FC<{ticker: ITickerViewModel}> = observer((props) => {
    const expirations = props.ticker.getExpirationsWithCallCreditSpreads()
    if(expirations.length === 0) {
        return (
            <NoStrategyAvailableBox>
                No call credit spreads available
            </NoStrategyAvailableBox>
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