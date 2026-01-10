import React from "react";
import {observer} from "mobx-react";
import {IOptionsExpirationVewModel} from "../../models/options-expiration.view-model.interface";
import {ITickerViewModel} from "../../models/ticker.view-model.interface";
import {EarningsDatePositionEnum} from "./helper-functions";
import {IOptionsStrategyViewModel} from "../../models/options-strategy.view-model.interface";
import {
    EarningsDateMarkerAfterExpirationComponent,
    EarningsDateMarkerBeforeExpirationComponent
} from "../earnings-date-marker.component";
import {ExpirationStrategiesComponent} from "./expiration-strategies.component";
import {OptionsStrategyComponent} from "./options-strategy.component";

interface OptionsExpirationStrategiesComponentProps {
    ticker: ITickerViewModel;
    expiration: IOptionsExpirationVewModel;
    strategies: IOptionsStrategyViewModel[];
    earningsDatePosition: EarningsDatePositionEnum;
}
export const OptionsExpirationStrategiesComponent: React.FC<OptionsExpirationStrategiesComponentProps> = observer((props) => {
    const strategies = props.strategies;
    const bestPop = Math.max(...strategies.map(strategy => strategy.pop));
    const bestRiskReward = Math.min(...strategies.map(strategy => strategy.riskRewardRatio));

    return (
        <React.Fragment>
            <EarningsDateMarkerBeforeExpirationComponent ticker={props.ticker} position={props.earningsDatePosition}/>
            <ExpirationStrategiesComponent expiration={props.expiration} strategiesCount={strategies.length}>
                {strategies.map(condor => (<OptionsStrategyComponent key={condor.key}
                                                                  strategy={condor} bestPop={bestPop}
                                                                  bestRiskReward={bestRiskReward}/>))}
            </ExpirationStrategiesComponent>
            <EarningsDateMarkerAfterExpirationComponent ticker={props.ticker} position={props.earningsDatePosition}/>
        </React.Fragment>

    );
})