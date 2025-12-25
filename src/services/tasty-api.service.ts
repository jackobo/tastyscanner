export class TastyApiService {
    private constructor() {
        this._getAccessTokenPromise = this._createAccessToken();
    }


    static readonly Instance = new TastyApiService();

    private readonly baseUrl = "https://api.tastyworks.com";
    //private readonly baseUrl = "https://api.cert.tastyworks.com/oauth/token";

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

    async getEquityData(...symbols: string[]): Promise<unknown> {
        const token = await this.getAccessToken();
        const response = await fetch(`${this.baseUrl}/market-data/by-type?equity=${symbols.join(",")}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();
        debugger;
        console.log(data);
        return data;
    }
}