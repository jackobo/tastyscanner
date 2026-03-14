import {IAppServiceFactory} from "../../services/app-service-factory.interface";
import {
    IOptionChainRawData,
    ISymbolInfoRawData,
    ISymbolMetricsRawData
} from "../../services/market-data-provider/market-data-provider.service.interface";

export class TickerMarketDataReader {
    constructor(private readonly symbol: string, private readonly services: IAppServiceFactory) {

    }

    private _symbolInfoPromise: Promise<ISymbolInfoRawData> | null = null;

    getSymbolInfo(): Promise<ISymbolInfoRawData> {
        if(!this._symbolInfoPromise) {
            this._symbolInfoPromise = this.services.marketDataProvider.getSymbolInfo(this.symbol);
        }

        return this._symbolInfoPromise;

    }

    private _symbolMetricsPromise: Promise<ISymbolMetricsRawData | null> | null = null;

    getSymbolMetrics(): Promise<ISymbolMetricsRawData | null> {
        if(!this._symbolMetricsPromise) {
            this._symbolMetricsPromise = this.services.marketDataProvider.getSymbolMetrics(this.symbol);
        }

        return this._symbolMetricsPromise;
    }

    private _symbolOptionsChainPromise: Promise<IOptionChainRawData[]> | null = null;

    getSymbolOptionsChain(): Promise<IOptionChainRawData[]> {
        if(!this._symbolOptionsChainPromise) {
            this._symbolOptionsChainPromise = this.services.marketDataProvider.getOptionsChain(this.symbol);
        }

        return this._symbolOptionsChainPromise;
    }
}