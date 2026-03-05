import {Asset} from "./asset";
import {IAssetResolver} from "./asset-resolver.interface";
export function makeAssets(assetsResolver: IAssetResolver) {
	return {
		icons: {
			logo_svg: new Asset('icons/logo.svg', assetsResolver),
		},
		images: {

		},
	}
}