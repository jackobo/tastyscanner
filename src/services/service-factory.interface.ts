import {ITickersService} from "./tickers/tickers.service.interface";
import {ISettingsService} from "./settings/settings.service.interface";
import {IMarketDataProviderService} from "./market-data-privider/market-data-provider.service.interface";

export interface IServiceFactory {
    readonly tickers: ITickersService;
    readonly settings: ISettingsService;
    readonly marketDataProvider: IMarketDataProviderService;
}