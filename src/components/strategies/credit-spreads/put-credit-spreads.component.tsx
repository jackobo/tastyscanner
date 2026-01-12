import React from "react";
import {observer} from "mobx-react";
import {ITickerViewModel} from "../../../models/ticker.view-model.interface";
import {IonAccordionGroup} from "@ionic/react";
import {NoOptionsStrategyAvailableBox} from "../boxes/no-options-strategy-available.box";
import {getEarningsDateRenderPosition} from "../helper-functions";
import {OptionsExpirationStrategiesComponent} from "../options-expiration-strategies.component";
import {IOptionsStrategyViewModel} from "../../../models/options-strategy.view-model.interface";


export const PutCreditSpreadsComponent: React.FC<{ticker: ITickerViewModel; onTrade: (strategy: IOptionsStrategyViewModel) => void;}> = observer((props) => {
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
            {expirations.map((expiration, index) => <OptionsExpirationStrategiesComponent
                                                                                         key={expiration.key}
                                                                                         ticker={props.ticker}
                                                                                         expiration={expiration}
                                                                                         strategies={expiration.putCreditSpreads}
                                                                                         onTrade={props.onTrade}
                                                                                         earningsDatePosition={getEarningsDateRenderPosition(props.ticker, expirations, index)}/>)}
        </IonAccordionGroup>
    )
})