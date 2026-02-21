import {IStorage} from "./storage.interface";


export interface IStorageService<TKey extends string> extends IStorage<TKey>{

}