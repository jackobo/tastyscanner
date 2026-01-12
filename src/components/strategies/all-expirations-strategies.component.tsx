import React, {useState} from "react";
import {observer} from "mobx-react";
import {IOptionsExpirationVewModel} from "../../models/options-expiration.view-model.interface";
import {NoOptionsStrategyAvailableBox} from "./boxes/no-options-strategy-available.box";
import {IonAccordionGroup} from "@ionic/react";
import {OptionsExpirationStrategiesComponent} from "./options-expiration-strategies.component";
import {getEarningsDateRenderPosition} from "./helper-functions";
import {ITickerViewModel} from "../../models/ticker.view-model.interface";
import {IOptionsStrategyViewModel} from "../../models/options-strategy.view-model.interface";
import {NullableString} from "../../utils/nullable-types";

interface AllExpirationsStrategiesComponentProps {
    ticker: ITickerViewModel;
    getExpirations: () => IOptionsExpirationVewModel[];
    getExpirationStrategies: (expiration: IOptionsExpirationVewModel) => IOptionsStrategyViewModel[];
    noStrategiesAvailableMessage: string;
    onTrade: (strategy: IOptionsStrategyViewModel) => void;
}
export const AllExpirationsStrategiesComponent: React.FC<AllExpirationsStrategiesComponentProps> = observer((props) => {

    const [expandedExpirationKey, setExpandedExpirationKey] = useState<NullableString>(null);
    const [expandedExpirationStrategies, setExpandedExpirationStrategies] = useState<IOptionsStrategyViewModel[]>([]);

    const expirations = props.getExpirations();
    if(expirations.length === 0) {
        return (
            <NoOptionsStrategyAvailableBox>
                {props.noStrategiesAvailableMessage}
            </NoOptionsStrategyAvailableBox>
        )
    }

    return  (
        <IonAccordionGroup onIonChange={(e) => {
            setExpandedExpirationKey(e.detail.value);
            const expiration = expirations.find(exp => exp.key === e.detail.value);
            if(expiration) {
                setExpandedExpirationStrategies(props.getExpirationStrategies(expiration));
            }
        }}>
            {expirations.map((expiration, index) => <OptionsExpirationStrategiesComponent
                key={expiration.key}
                ticker={props.ticker}
                expiration={expiration}
                strategies={expiration.key === expandedExpirationKey ? expandedExpirationStrategies : props.getExpirationStrategies(expiration)}
                onTrade={props.onTrade}
                earningsDatePosition={getEarningsDateRenderPosition(props.ticker, expirations, index)}/>)}
        </IonAccordionGroup>
    )
})