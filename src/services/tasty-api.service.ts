
import {TickerModel} from "../models/ticker.model";

export class TastyApiService {
    private constructor() {

        this.tickers = [new TickerModel("NVDA") /*, new TickerModel("GOOGL")*/];
    }


    public tickers: TickerModel[];
    static readonly Instance = new TastyApiService();

    //private readonly baseUrl = "https://api.tastyworks.com";
    //private readonly baseUrl = "https://api.cert.tastyworks.com/oauth/token";


    start(): void {

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