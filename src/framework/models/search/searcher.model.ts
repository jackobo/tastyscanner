import {Check} from "../../utils/type-checking";
import {computed, makeObservable, observable, runInAction} from "mobx";
import {ISearcherViewModel} from "./searcher.view-model.interface";

export abstract class SearcherModel<TItem> implements ISearcherViewModel<TItem>{
    protected constructor(protected readonly _getAllItems: () => TItem[] ) {
        makeObservable<this, '_query' | 'filteredItems'>(this, {
            filteredItems: computed,
            _query: observable.ref
        });
    }

    protected abstract _shouldIncludeItem(item: TItem, query: string): boolean;

    private _query: string = "";
    applyFilter(query: string): void {
        runInAction(() => {
            this._query = (query?.trim() ?? "").toLowerCase();
        });
    }

    private get filteredItems(): TItem[] {
        if(Check.isEmpty(this._query)) {
            return this._getAllItems();
        }

        return this._getAllItems().filter(item => this._shouldIncludeItem(item, this._query));
    }

    getFilteredItems(): TItem[] {
        return this.filteredItems;
    }


}