import React, {CSSProperties} from "react";

export type TableColumnType = 'string' | 'number' | 'date' | 'any';

export interface TableColumnDefinition<TItem> {
    getValue: (item: TItem) => any;
    /**
     * If not provided will default to string
     */
    columnType?: TableColumnType;
    /**
     * If not provided will default to true
     */
    sortable?: boolean;
    compare?: (a: TItem, b: TItem) => number;
    renderHeaderCellContent: () => React.ReactElement | null | undefined | string | number;
    /**
     * If not provided will default to getValue(item)
     * @param item
     */
    renderBodyCellContent?: (item: TItem) => React.ReactElement  | null | undefined | string | number;
    headerCellCssProps?: CSSProperties;
    bodyCellCssProps?: CSSProperties;
}


export interface ITableSortedColumn<TItem> {
    column: TableColumnDefinition<TItem>;
    direction: 'asc' | 'desc';
}