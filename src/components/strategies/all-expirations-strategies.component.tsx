import React from "react";
import {observer} from "mobx-react";
import {IOptionsExpirationVewModel} from "../../models/options-expiration.view-model.interface";
import {NoOptionsStrategyAvailableBox} from "./boxes/no-options-strategy-available.box";
import {IonAccordionGroup} from "@ionic/react";
import {OptionsExpirationStrategiesComponent} from "./options-expiration-strategies.component";
import {getEarningsDateRenderPosition} from "./helper-functions";
import {ITickerViewModel} from "../../models/ticker.view-model.interface";
import {IOptionsStrategyViewModel} from "../../models/options-strategy.view-model.interface";

interface AllExpirationsStrategiesComponentProps {
    ticker: ITickerViewModel;
    getExpirations: () => IOptionsExpirationVewModel[];
    noStrategiesAvailableMessage: string;
    onTrade: (strategy: IOptionsStrategyViewModel) => void;
}
export const AllExpirationsStrategiesComponent: React.FC<AllExpirationsStrategiesComponentProps> = observer((props) => {
    const expirations = props.getExpirations();
    if(expirations.length === 0) {
        return (
            <NoOptionsStrategyAvailableBox>
                {props.noStrategiesAvailableMessage}
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
                onTrade={props.onTrade}
                earningsDatePosition={getEarningsDateRenderPosition(props.ticker, expirations, index)}/>)}
        </IonAccordionGroup>
    )
})