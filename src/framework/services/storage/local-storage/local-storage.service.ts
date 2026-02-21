import {StorageService} from "../storage.service";
import {UndefinedString} from "../../../types/nullable-types";

/**
 * Stores the keys as they are provided. No environment is appended to the key
 */
export class LocalStorageService<TKey extends string> extends StorageService<TKey> {
    constructor() {
        super(localStorage);
    }

    protected _composeKey(key: TKey, discriminator: UndefinedString): string {
        if(discriminator) {
            return `${key}.${discriminator}`;
        } else {
            return key;
        }
    }

}