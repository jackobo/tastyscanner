import {IStorageService} from "./storage.service.interface";
import {IStorageKeyDescriptor, IStorageOptions} from "./storage.interface";
import {NullableString, UndefinedString} from "../../types/nullable-types";
import {Check} from "../../utils/type-checking";


export abstract class StorageService<TKey extends string> implements IStorageService<TKey>{
    protected constructor(private readonly realStorage: Storage) {
    }


    protected _composeKey(key: TKey, discriminator: UndefinedString): string {
        if(discriminator) {
            return `${key}.${discriminator}`;
        } else {
            return key;
        }
    }


    setItem(key: TKey, value: string, options?: IStorageOptions): void {

        const composedKey = this._composeKey(key, options?.discriminator);
        this.realStorage.setItem(composedKey, value);
    }

    getItem(key: TKey, options?: IStorageOptions): NullableString {
        return this.realStorage.getItem(this._composeKey(key, options?.discriminator)) ?? null;
    }

    setJson(key: TKey, value: object, options?: IStorageOptions): void {
        if(value) {
            this.setItem(key, JSON.stringify(value), options);
        } else {
            this.removeItem(key, options);
        }
    }

    getJson<TValue = any>(key: TKey, options?: IStorageOptions): TValue | null {
        const value = this.getItem(key, options);

        if (value) {
            return JSON.parse(value) as TValue;
        } else {
            return null;
        }
    }

    removeItem(key: TKey, options?: IStorageOptions): void {
        this.realStorage.removeItem(this._composeKey(key, options?.discriminator));
    }

    getDiscriminators(key: TKey): IStorageKeyDescriptor<TKey>[] {
        const discriminators: IStorageKeyDescriptor<TKey>[] = [];

        for (let i = 0; i < this.realStorage.length; i++) {
            const existingKey = this.realStorage.key(i);
            if (Check.isNullOrUndefined(existingKey)) {
                continue;
            }

            const keyPrefix = `${key}.`;
            if(existingKey.startsWith(keyPrefix)) {
                const disc = existingKey.split(keyPrefix)[1];
                discriminators.push({
                    key: key,
                    discriminator: disc,
                    fullKey: existingKey
                });

            }
        }

        return discriminators;
    }
}