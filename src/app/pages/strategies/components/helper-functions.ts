import {ITickerViewModel} from "../../../models/ticker/ticker.view-model.interface";
import {IOptionsExpirationVewModel} from "../../../models/options-expiration.view-model.interface";
import {Check} from "../../../../framework/utils/type-checking";


export enum EarningsDatePositionEnum {
    None,
    Before,
    After
}

export function getEarningsDateRenderPosition(ticker: ITickerViewModel, expirations: IOptionsExpirationVewModel[], expirationIndex: number): EarningsDatePositionEnum {
    const metrics = ticker?.metrics;
    if(Check.isNullOrUndefined(metrics?.daysUntilEarnings) || Check.isNullOrUndefined(metrics?.earningsDate)) {
        return EarningsDatePositionEnum.None;
    }

    const earningsDate = metrics.earningsDate;

    if(earningsDate.getTime() < Date.now()) {
        return EarningsDatePositionEnum.None;
    }

    const daysUntilEarnings = metrics.daysUntilEarnings;
    const currentExpiration = expirations[expirationIndex];

    if(expirationIndex === 0) {
        if(daysUntilEarnings <= currentExpiration.daysToExpiration) {
            return EarningsDatePositionEnum.Before;
        }
    }

    const nextExpiration = expirations[expirationIndex + 1];

    if(nextExpiration) {
        if(daysUntilEarnings > currentExpiration.daysToExpiration && daysUntilEarnings <= nextExpiration.daysToExpiration) {
            return EarningsDatePositionEnum.After;
        }

    } else {
        if(daysUntilEarnings > currentExpiration.daysToExpiration) {
            return EarningsDatePositionEnum.After;
        }
    }


    return EarningsDatePositionEnum.None;

}