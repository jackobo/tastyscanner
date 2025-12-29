import TastyTradeClient from "@tastytrade/api"
import {MarketDataSubscriptionType} from "@tastytrade/api/lib/quote-streamer";
export class TastyApiService {
    private constructor() {
        //this._getAccessTokenPromise = this._createAccessToken();
        this._tastyClient = new TastyTradeClient({
            ...TastyTradeClient.ProdConfig,
            clientSecret: import.meta.env.VITE_CLIENT_SECRET,
            refreshToken: import.meta.env.VITE_REFRESH_TOKEN,
            oauthScopes: ['read']
        });
        this._startPromise = this._start();

        //this._tastyClient.marketMetricsService.getMarketMetrics([".NVDA260102C187.5"]).then(console.log);

    }

    private _startPromise: Promise<void>;

    private _quotesMap: Record<string, unknown> = {};

    private async _start() {
        await this._tastyClient.quoteStreamer.connect();

        const optionsChain = await this._tastyClient.instrumentsService.getNestedOptionChain("NVDA");

        const optionsSymbols: string[] = [];



        for(const optionChain of optionsChain) {
            for(const expiration of optionChain.expirations) {
                for(const strike of expiration.strikes) {
                    const strikePrice = parseFloat(strike["strike-price"]);
                    if(strikePrice > 170 && strikePrice < 200) {
                        optionsSymbols.push(strike["call-streamer-symbol"]);
                        optionsSymbols.push(strike["put-streamer-symbol"]);
                    }

                }
            }
        }

        for(const symbol of optionsSymbols) {
            this._quotesMap[symbol] = undefined;
        }

        console.log(optionsSymbols.length);
        this._tastyClient.quoteStreamer.subscribe(optionsSymbols, [
            //MarketDataSubscriptionType.Quote,
            //MarketDataSubscriptionType.Trade,
            //MarketDataSubscriptionType.Summary,
            //MarketDataSubscriptionType.Profile,
            MarketDataSubscriptionType.Greeks,
            //MarketDataSubscriptionType.Underlying
        ]);



        this._tastyClient.quoteStreamer.addEventListener((quote: any[]) => {
            console.log(quote);
            for(const symbolData of quote) {
                this._quotesMap[symbolData.eventSymbol] = symbolData;
            }

            let countEmpty = 0;
            for(const symbol of Object.keys(this._quotesMap)) {
                if(this._quotesMap[symbol] === undefined) {
                    countEmpty++;
                }
            }

            console.log("countEmpty: " + countEmpty);

        })
    }

    private _tastyClient: TastyTradeClient;

    static readonly Instance = new TastyApiService();

    private readonly baseUrl = "https://api.tastyworks.com";
    //private readonly baseUrl = "https://api.cert.tastyworks.com/oauth/token";

    async getNestedOptionsChain(symbol: string): Promise<unknown> {
        await this._startPromise;
        return await this._tastyClient.instrumentsService.getNestedOptionChain(symbol)
    }

    /*
    public getAccessToken(): Promise<string> {
        return this._getAccessTokenPromise;
    }

    private _getAccessTokenPromise: Promise<string>;

    private async _createAccessToken(): Promise<string> {
        const response = await fetch(`${this.baseUrl}/oauth/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                grant_type: "refresh_token",
                refresh_token: import.meta.env.VITE_REFRESH_TOKEN,
                client_secret: import.meta.env.VITE_CLIENT_SECRET

            })
        })


        const data = await response.json();

        return data.access_token;
    }

    private async _get(path: string): Promise<unknown> {
        if(!path.startsWith("/")) {
            path = `/${path}`;
        }
        const token = await this.getAccessToken();
        const response = await fetch(`${this.baseUrl}${path}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return await response.json();
    }



    async getEquityData(...symbols: string[]): Promise<unknown> {
        return await this._get(`market-data/equities/${symbols.join(",")}`);
    }

    async getNestedOptionsChain(symbol: string): Promise<unknown> {
        return await this._get(`/option-chains/${symbol}/nested`);
    }

    async getDetailedOptionsChain(symbol: string): Promise<unknown> {
        return await this._get(`/option-chains/${symbol}`);
    }

    async getOptionQuote(symbol: string): Promise<unknown> {
        return await this._get(`/market-data/by-type?equity-option=${symbol}`);
    }
    */
}