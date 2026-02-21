import React from "react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {ITableSortedColumn, TableColumnDefinition} from "./table.component.interfaces";
import {TableHeaderComponent} from "./header/table-header.component";
import {TableBodyComponent} from "./body/table-body.component";


function sortItems<TItem>(items: TItem[], sortedColumn: ITableSortedColumn<TItem>): TItem[] {
    let compareFunction: (a: TItem, b: TItem) => number;
    if(sortedColumn.column.compare) {
        if(sortedColumn.direction === "asc") {
            compareFunction = (a: TItem, b: TItem) => sortedColumn.column.compare!(a, b);
        } else {
            compareFunction = (a: TItem, b: TItem) => -1 * sortedColumn.column.compare!(a, b);
        }
    } else {
        switch (sortedColumn.column.columnType) {
            case "number":
                if(sortedColumn.direction === "asc") {
                    compareFunction = (a, b) => (sortedColumn.column.getValue(a) as number ?? 0) - (sortedColumn.column.getValue(b) as number ?? 0)
                } else {
                    compareFunction = (a, b) => (sortedColumn.column.getValue(b) as number ?? 0) - (sortedColumn.column.getValue(a) as number ?? 0)
                }
                break;
            case "date":
                if(sortedColumn.direction === "asc") {
                    compareFunction = (a, b) => ((sortedColumn.column.getValue(a) as Date)?.getTime() ?? 0) - ((sortedColumn.column.getValue(b) as Date)?.getTime() ?? 0)
                } else {
                    compareFunction = (a, b) => ((sortedColumn.column.getValue(b) as Date)?.getTime() ?? 0) - ((sortedColumn.column.getValue(a) as Date)?.getTime() ?? 0)
                }
                break;
            default:
                if(sortedColumn.direction === "asc") {
                    compareFunction = (a, b) => (sortedColumn.column.getValue(a)?.toString() ?? "").localeCompare(sortedColumn.column.getValue(b)?.toString() ?? "")
                } else {
                    compareFunction = (a, b) => (sortedColumn.column.getValue(b)?.toString() ?? "").localeCompare(sortedColumn.column.getValue(a)?.toString() ?? "")
                }
                break;
        }
    }

    return [...items].sort(compareFunction);
}

const TableBox = styled.table`
    width: 100%;
`


interface TableComponentProps<TItem> {
    columns: TableColumnDefinition<TItem>[];
    items: TItem[];
    getItemKey: (item: TItem) => any;
    onMouseEnterRow?: (item: TItem) => void;
    onMouseLeaveRow?: (item: TItem) => void;
}

export const TableComponent = observer(<TItem extends any>(props: TableComponentProps<TItem>) => {
    const [sortedColumn, setSortedColumn] = React.useState<ITableSortedColumn<TItem> | null>(null);
    const Header = TableHeaderComponent<TItem>;
    const Body = TableBodyComponent<TItem>;

    const onColumnHeaderClick = (column: TableColumnDefinition<TItem>) => {
        if(sortedColumn) {
            if(sortedColumn.column === column) {
                setSortedColumn({column, direction: sortedColumn.direction === "asc" ? "desc" : "asc"});
            } else {
                setSortedColumn({column, direction: "asc"});
            }
        } else {
            setSortedColumn({column, direction: "asc"});
        }
    }

    const getSortedItems = () => {
        if(sortedColumn) {
            return sortItems(props.items, sortedColumn);
        } else {
            return props.items;
        }
    }

    return (
        <TableBox>
           <Header columns={props.columns}
                   sortedColumn={sortedColumn}
                   onColumnClick={onColumnHeaderClick}/>
           <Body columns={props.columns}
                 items={getSortedItems()}
                 getItemKey={props.getItemKey}
                 onMouseEnterRow={props.onMouseEnterRow}
                 onMouseLeaveRow={props.onMouseLeaveRow}/>
        </TableBox>
    );
})