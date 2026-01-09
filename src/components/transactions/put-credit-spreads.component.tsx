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


const PutCreditSpreadComponent: React.FC<{putCreditSpread: ICreditSpreadViewModel; bestPop: number; bestRiskReward: number}> = observer((props) => {

    return (
        <IonCard>
            <StrategyBox $isBestRiskReward={props.putCreditSpread.riskRewardRatio === props.bestRiskReward}
                         $isBestPop={props.putCreditSpread.pop === props.bestPop}>
                <StrategyHeaderComponent/>
                <StrategyLegComponent option={props.putCreditSpread.btoOption} isSellOption={false}/>
                <StrategyLegComponent option={props.putCreditSpread.stoOption} isSellOption={true}/>
                <StrategyFooterComponent transaction={props.putCreditSpread}/>
            </StrategyBox>
        </IonCard>
    )
})

const ExpirationPutCreditSpreadsComponent: React.FC<{ticker: ITickerViewModel; expiration: IOptionsExpirationVewModel; earningsDatePosition: EarningsDatePositionEnum}> = observer((props) => {

    const putCreditSpreads = props.expiration.putCreditSpreads;
    const bestPop = Math.max(...putCreditSpreads.map(condor => condor.pop));
    const bestRiskReward = Math.min(...putCreditSpreads.map(condor => condor.riskRewardRatio));
    return (
        <React.Fragment>
            <EarningsDateMarkerBeforeExpirationComponent ticker={props.ticker} position={props.earningsDatePosition}/>
            <ExpirationStrategiesComponent expiration={props.expiration} transactionsCount={putCreditSpreads.length}>
                {putCreditSpreads.map(putCreditSpread => <PutCreditSpreadComponent key={putCreditSpread.key} putCreditSpread={putCreditSpread} bestPop={bestPop} bestRiskReward={bestRiskReward}/>)}
            </ExpirationStrategiesComponent>
            <EarningsDateMarkerAfterExpirationComponent ticker={props.ticker} position={props.earningsDatePosition}/>
        </React.Fragment>
    );

});


export const PutCreditSpreadsComponent: React.FC<{ticker: ITickerViewModel}> = observer((props) => {
    const expirations = props.ticker.getExpirationsWithPutCreditSpreads()
    if(expirations.length === 0) {
        return (
            <NoStrategyAvailableBox>
                No put credit spreads available
            </NoStrategyAvailableBox>
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