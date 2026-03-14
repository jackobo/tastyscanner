import {StorageService} from "../storage.service";


/**
 * Stores the keys as they are provided. No environment is appended to the key
 */
export class LocalStorageService<TKey extends string> extends StorageService<TKey> {
    constructor() {
        super(localStorage);
    }


}