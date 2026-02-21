import React, {useEffect} from "react";
import {IStandardDropDownItemViewModel} from "../../models/item/standard-drop-down-list-item-view-model.interface";
import {observer} from "mobx-react";
import styled from "styled-components";
import {IStandardDropDownListViewModel} from "../../models/list/standard-drop-down-list-view-model.interface";
import {reaction} from "mobx";


const DropDownItemContainerBox = styled.div`
    width: 100%;
    cursor: pointer;
    color: var(--ion-color-dark);
`

interface StandardDropDownItemComponentProps<TFieldValue> {
    item: IStandardDropDownItemViewModel<TFieldValue>;
    index: number;
    listViewModel: IStandardDropDownListViewModel<TFieldValue>;
}

export const StandardDropDownListItemComponent = observer(<TFieldValue extends any>(props: StandardDropDownItemComponentProps<TFieldValue>) => {
    const boxRef = React.createRef<HTMLDivElement>();

    useEffect(() => {
        const disposeReaction = reaction(() => props.listViewModel.currentFocusedItemIndex,
            () => {
                if(props.index === props.listViewModel.currentFocusedItemIndex) {
                    const boxEl = boxRef.current;
                    if(boxEl) {
                        boxEl.scrollIntoView({
                            block: "nearest",
                            inline: "nearest"
                        });
                    }

                }
            });
        return () => {
            disposeReaction();
        };
    }, [boxRef, props.index, props.listViewModel.currentFocusedItemIndex]);

    const onClickHandler = () => {
        props.listViewModel.setSelectedItem(props.item);
    }

    const onMouseEnterHandler = () => {
        props.listViewModel.currentFocusedItemIndex = props.index;
    }


    const isCurrent = (props.index === props.listViewModel.currentFocusedItemIndex);
    const isPrevious = (props.index === props.listViewModel.currentFocusedItemIndex - 1);
    const isLast = (props.index === props.listViewModel.filteredItems.length - 1);

    return (
        <DropDownItemContainerBox onClick={onClickHandler}
                                  ref={boxRef}
                                  onMouseEnter={onMouseEnterHandler}>
            {props.item.renderItem({
                isRenderedInModalDialog: props.listViewModel.isInsideModalDialog,
                isCurrent: isCurrent,
                isPrevious: isPrevious,
                isLast: isLast
            })}
        </DropDownItemContainerBox>
    )
});

