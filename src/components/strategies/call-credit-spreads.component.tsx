import React from "react";
import {observer} from "mobx-react";
import {ITickerViewModel} from "../../models/ticker.view-model.interface";
import {IonAccordionGroup} from "@ionic/react";
import {NoOptionsStrategyAvailableBox} from "./boxes/no-options-strategy-available.box";
import {getEarningsDateRenderPosition} from "./helper-functions";
import {OptionsExpirationStrategiesComponent} from "./options-expiration-strategies.component";




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
            {expirations.map((expiration, index) => <OptionsExpirationStrategiesComponent
                                                                                         key={expiration.key}
                                                                                         ticker={props.ticker}
                                                                                         expiration={expiration}
                                                                                         strategies={expiration.callCreditSpreads}
                                                                                         earningsDatePosition={getEarningsDateRenderPosition(props.ticker, expirations, index)}/>)}
        </IonAccordionGroup>
    )
})