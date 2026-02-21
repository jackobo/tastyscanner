import styled, {css} from "styled-components";
import {ITableSortedColumn, TableColumnDefinition} from "../table.component.interfaces";
import {observer} from "mobx-react";
import React from "react";

const TableHeaderBox = styled.thead`
    background-color: var(--ion-color-dark);
    color: var(--ion-color-dark-contrast);
`


const TableHeaderRowBox = styled.tr`
`


const TableHeadCellBox = styled.th<{$isSortable: boolean}>`
    text-align: center;
    border: 1px solid var(--ion-color-light);
    padding: var(--ion-space-8);
    ${props => props.$isSortable && css`cursor: pointer;`}
`

const SortIndicatorBox = styled.span`
    margin-left:4px;
`


interface TableHeaderCellComponentProps<TItem> {
    column: TableColumnDefinition<TItem>;
    onColumnClick: (column: TableColumnDefinition<TItem>) => void;
    sortedColumn: ITableSortedColumn<TItem> | null;
}
const TableHeaderCellComponent = observer(<TItem extends any>(props: TableHeaderCellComponentProps<TItem>) => {


    const isSortable = props.column.sortable ?? true;
    const isSorted = props.sortedColumn?.column === props.column;

    const onClick = () => {
        if(isSortable) {
            props.onColumnClick(props.column);
        }
    }

    const renderSortedIndicator = () => {
        if(!isSortable) {
            return null;
        }
        if(!isSorted) {
            return null;
        }

        if(props.sortedColumn?.direction === "asc") {
            return (
                <SortIndicatorBox>▲</SortIndicatorBox>
            )
        } else {
            return (
                <SortIndicatorBox>▼</SortIndicatorBox>
            );
        }
    }

    return (
        <TableHeadCellBox style={props.column.headerCellCssProps} onClick={onClick} $isSortable={isSortable}>
            {props.column.renderHeaderCellContent()}
            {renderSortedIndicator()}
        </TableHeadCellBox>
    )
});


interface TableHeaderRowComponentProps<TItem> {
    columns: TableColumnDefinition<TItem>[];
    onColumnClick: (column: TableColumnDefinition<TItem>) => void;
    sortedColumn: ITableSortedColumn<TItem> | null;
}

const TableHeaderRowComponent = observer(<TItem extends any>(props: TableHeaderRowComponentProps<TItem>) => {
    const CellComponent = TableHeaderCellComponent<TItem>;
    return (
        <TableHeaderRowBox>
            {props.columns.map((column, index) => <CellComponent key={index}
                                                                                                 column={column}
                                                                                                 onColumnClick={props.onColumnClick}
                                                                                                 sortedColumn={props.sortedColumn}/>)}
        </TableHeaderRowBox>
    )
})


interface TableHeaderComponentProps<TItem> {
    columns: TableColumnDefinition<TItem>[];
    onColumnClick: (column: TableColumnDefinition<TItem>) => void;
    sortedColumn: ITableSortedColumn<TItem> | null;
}

export const TableHeaderComponent = observer(<TItem extends any>(props: TableHeaderComponentProps<TItem>) => {
    const TableHeaderRow = TableHeaderRowComponent<TItem>;
    return (
        <TableHeaderBox>
            <TableHeaderRow columns={props.columns} onColumnClick={props.onColumnClick} sortedColumn={props.sortedColumn}/>
        </TableHeaderBox>
    )
})