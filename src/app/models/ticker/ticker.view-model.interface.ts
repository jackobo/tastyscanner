import {IOptionsExpirationVewModel} from "../options-expiration.view-model.interface";
import {ITickerInfoViewModel} from "./ticker-info.view-model.interface";
import {ITickerMetricsViewModel} from "./ticker-metrics.view-model.interface";

export interface ITickerViewModel {
    readonly isLoading: boolean;
    readonly currentPrice: number;
    readonly symbol: string;

    readonly info: ITickerInfoViewModel | null;
    readonly metrics: ITickerMetricsViewModel | null;
    readonly optionsChain: IOptionsExpirationVewModel[];

    getInfoAsync(): Promise<ITickerInfoViewModel>;
    getMetricsAsync(): Promise<ITickerMetricsViewModel>;
    getOptionsChainAsync(): Promise<IOptionsExpirationVewModel[]>;


    getExpirationsWithIronCondors(): IOptionsExpirationVewModel[];
    getExpirationsWithPutCreditSpreads(): IOptionsExpirationVewModel[];
    getExpirationsWithCallCreditSpreads(): IOptionsExpirationVewModel[];

}