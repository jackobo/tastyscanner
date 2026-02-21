export interface ISearcherViewModel<TItem> {
    applyFilter(query: string): void;
    getFilteredItems(): TItem[];
}