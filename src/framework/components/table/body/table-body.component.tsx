import styled from "styled-components";
import {TableColumnDefinition} from "../table.component.interfaces";
import {observer} from "mobx-react";
import React from "react";

const TableBodyBox = styled.tbody`
`

const TableBodyRowBox = styled.tr`
    &:hover {
        background-color: var(--ion-color-light-shade);
        color: var(--ion-color-light-contrast);
    }
`

const TableBodyCellBox = styled.td`
    text-align: center;
    border: 1px solid var(--ion-color-border);
    padding: var(--ion-space-8);
`


interface TableBodyCellComponentProps<TItem> {
    column: TableColumnDefinition<TItem>;
    item: TItem;
}
const TableBodyCellComponent = observer(<TItem extends any>(props: TableBodyCellComponentProps<TItem>) => {
    const renderContent = () => {
        if(props.column.renderBodyCellContent) {
            return props.column.renderBodyCellContent(props.item);
        }

        return props.column.getValue(props.item);
    }
    return (
        <TableBodyCellBox style={props.column.bodyCellCssProps}>
            {renderContent()}
        </TableBodyCellBox>
    )
});


interface TableBodyRowComponentProps<TItem> {
    item: TItem;
    columns: TableColumnDefinition<TItem>[];
    onMouseEnterRow?: (item: TItem) => void;
    onMouseLeaveRow?: (item: TItem) => void;
}

const TableBodyRowComponent = observer(<TItem extends any>(props: TableBodyRowComponentProps<TItem>) => {
    const CellComponent = TableBodyCellComponent<TItem>;
    const onMouseEnter = () => {
        if(props.onMouseEnterRow) {
            props.onMouseEnterRow(props.item);
        }
    }

    const onMouseLeave = () => {
        if(props.onMouseLeaveRow) {
            props.onMouseLeaveRow(props.item);
        }
    }
    return (
        <TableBodyRowBox onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            {props.columns.map((column, index) => (<CellComponent key={index} column={column} item={props.item}/>))}
        </TableBodyRowBox>
    )
})

interface TableBodyComponentProps<TItem> {
    columns: TableColumnDefinition<TItem>[];
    items: TItem[];
    getItemKey: (item: TItem) => any;
    onMouseEnterRow?: (item: TItem) => void;
    onMouseLeaveRow?: (item: TItem) => void;
}

export const TableBodyComponent = observer(<TItem extends any>(props: TableBodyComponentProps<TItem>) => {
    const TableBodyRow = TableBodyRowComponent<TItem>;
    return (
        <TableBodyBox>
            {props.items.map(item => (<TableBodyRow key={props.getItemKey(item)} item={item} columns={props.columns} onMouseEnterRow={props.onMouseEnterRow} onMouseLeaveRow={props.onMouseLeaveRow} />))}
        </TableBodyBox>
    )
})