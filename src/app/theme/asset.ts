import {IAsset} from "./asset.interface";
import {IAssetResolver} from "./asset-resolver.interface";

export class Asset implements IAsset {
    constructor(private readonly _relativePath: string,
                private readonly _assetsResolver: IAssetResolver,
                private readonly _localizations: string[] = []) {
    }

    toString(): string {
        return this._assetsResolver.resolveAssetPath(this._relativePath, this._localizations);
    }
}
