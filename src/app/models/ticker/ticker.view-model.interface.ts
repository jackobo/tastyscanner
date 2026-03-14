import {IOptionsExpirationVewModel} from "../options-expiration.view-model.interface";
import {TickerInfoViewModel} from "./ticker-info.view-model.interface";
import {ITickerMetricsViewModel} from "./ticker-metrics.view-model.interface";

export interface ITickerViewModel {
    readonly symbol: string;
    readonly info: TickerInfoViewModel | null;
    readonly metrics: ITickerMetricsViewModel | null;

    readonly currentPrice: number;
    readonly isLoading: boolean;
    readonly optionsChain: IOptionsExpirationVewModel[];


    getExpirationsWithIronCondors(): IOptionsExpirationVewModel[];
    getExpirationsWithPutCreditSpreads(): IOptionsExpirationVewModel[];
    getExpirationsWithCallCreditSpreads(): IOptionsExpirationVewModel[];

}