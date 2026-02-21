export enum EnvironmentType {
    Development = 1,
    Test = 2,
    Stage = 3,
    Production = 4
}

export class EnvironmentApiConfig {
    constructor(private readonly baseUrl: string) {

    }

    public buildApiUrl(endpoint: string): string {
        const baseUrl = this.baseUrl.endsWith('/')
            ? this.baseUrl.slice(0, -1)
            : this.baseUrl;

        const cleanEndpoint = endpoint.startsWith('/')
            ? endpoint
            : `/${endpoint}`;
        return `${baseUrl}${cleanEndpoint}`;
    }
}

export interface IEnvironmentConfig {
    environmentType: EnvironmentType;
    host: string;
    cashDropOrchestratorApi: EnvironmentApiConfig;
}