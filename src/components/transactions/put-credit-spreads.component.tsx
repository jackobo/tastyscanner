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


const PutCreditSpreadComponent: React.FC<{putCreditSpread: ICreditSpreadViewModel}> = observer((props) => {

    return (
        <IonCard>
            <StrategyBox>
                <StrategyHeaderComponent/>
                <StrategyLegComponent option={props.putCreditSpread.btoOption} isSellOption={false}/>
                <StrategyLegComponent option={props.putCreditSpread.stoOption} isSellOption={true}/>
                <StrategyFooterComponent transaction={props.putCreditSpread}/>
            </StrategyBox>
        </IonCard>
    )
})

const ExpirationPutCreditSpreadsComponent: React.FC<{expiration: IOptionsExpirationVewModel}> = observer((props) => {

    const putCreditSpreads = props.expiration.putCreditSpreads;

    return (
        <ExpirationStrategiesComponent expiration={props.expiration} transactionsCount={putCreditSpreads.length}>
            {putCreditSpreads.map(putCreditSpread => <PutCreditSpreadComponent key={putCreditSpread.key} putCreditSpread={putCreditSpread}/>)}
        </ExpirationStrategiesComponent>
    );
});


export const PutCreditSpreadsComponent: React.FC<{ticker: ITickerViewModel}> = observer((props) => {
    const expirations = props.ticker.getExpirationsWithPutCreditSpreads()
    if(expirations.length === 0) {
        return null;
    }

    return  (
        <IonAccordionGroup>
            {expirations.map(expiration => <ExpirationPutCreditSpreadsComponent key={expiration.key} expiration={expiration}/>)}
        </IonAccordionGroup>
    )
})