import React from 'react';
import {IOptionsExpirationVewModel} from "../../models/options-expiration.view-model.interface";
import {observer} from "mobx-react-lite";
import {IonAccordionGroup} from '@ionic/react';
import {ITickerViewModel} from "../../models/ticker.view-model.interface";
import {NoOptionsStrategyAvailableBox} from "./boxes/no-options-strategy-available.box";
import {getEarningsDateRenderPosition} from "./helper-functions";
import {OptionsExpirationStrategiesComponent} from "./options-expiration-strategies.component";



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
            {expirations.map((expiration, index) => <OptionsExpirationStrategiesComponent
                                                                                    key={expiration.key}
                                                                                    ticker={props.ticker}
                                                                                    expiration={expiration}
                                                                                    strategies={expiration.ironCondors}
                                                                                    earningsDatePosition={getEarningsDateRenderPosition(props.ticker, expirations, index)}/>)}
        </IonAccordionGroup>
    )
})