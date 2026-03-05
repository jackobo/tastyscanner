export interface IAssetResolver {
    resolveAssetPath(relativePath: string, supportedLocalizations: string[]): string;
}

