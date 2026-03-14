import {StorageService} from "../storage.service";

/**
 * Stores the keys as they are provided. No environment is appended to the key
 */
export class SessionStorageService<TKey extends string> extends StorageService<TKey> {
    constructor() {
        super(sessionStorage);
    }



}