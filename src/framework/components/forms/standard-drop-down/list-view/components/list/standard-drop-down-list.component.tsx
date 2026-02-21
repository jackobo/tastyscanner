import React from "react";
import {IStandardDropDownItemViewModel} from "../../models/item/standard-drop-down-list-item-view-model.interface";
import {IStandardDropDownListViewModel} from "../../models/list/standard-drop-down-list-view-model.interface";
import styled from "styled-components";
import {StandardDropDownListItemComponent} from "../item/standard-drop-down-list-item.component";
import {observer} from "mobx-react";
import {EmptyDropDownMessageComponent} from "../../../../drop-down/empty-drop-down-message.component";


const DropDownListContainerBox = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 100px;
    max-height: 300px;
    overflow-y: auto;
/*
    scrollbar-width: none;
    &::-webkit-scrollbar {
        display: none
    }
*/
    

`



interface StandardDropDownListComponentProps<TFieldValue> {
    listViewModel: IStandardDropDownListViewModel<TFieldValue>;
    renderEmptyListMessage?: () => React.ReactElement | string;
}


export const  StandardDropDownListComponent = observer(<TFieldValue extends any>(props: StandardDropDownListComponentProps<TFieldValue>) => {
    const DropDownItem = StandardDropDownListItemComponent<TFieldValue>;


    const renderItem = (item: IStandardDropDownItemViewModel<TFieldValue>, index: number) => {
        return (
            <DropDownItem key={item.key}
                          index={index}
                          item={item}
                          listViewModel={props.listViewModel}/>
        );
    }


    const renderItems = () => {
        if(props.listViewModel.unfilteredItemsCount === 0) {
            if(props.renderEmptyListMessage) {
                return (
                    <EmptyDropDownMessageComponent message={props.renderEmptyListMessage()}/>
                );
            } else {
                return null;
            }
        }

        return props.listViewModel.filteredItems.map(renderItem);
    }

    return (
        <DropDownListContainerBox>
            {renderItems()}
        </DropDownListContainerBox>
    )
});



