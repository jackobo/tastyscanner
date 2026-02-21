import React from "react";
import {IRenderStandardDropDownItemOptions, IStandardDropDownItemViewModel} from "./standard-drop-down-list-item-view-model.interface";
import styled, {css} from "styled-components";

const DropDownItemBox = styled.div<{$isCurrent: boolean; $isLast: boolean}>`
    width: 100%;
    padding: var(--ion-space-12) var(--ion-space-8);
    color: var(--ion-color-dark);

    ${
            props => props.$isCurrent
                    ? css`
                        background-color: var(--ion-color-light-shade);
                    `
                    : ''

    }
    
   

    ${
            props => props.$isLast
                    ? css`
                        border-bottom: none;
                    `
                    : css`
                        border-bottom: 1px solid var(--ion-color-border);
                    `

    }
`

const InsideModalDialogDropDownItemBox = styled(DropDownItemBox)`
    text-align: center;
    font-size: var(--ion-font-size-h3);
    padding: var(--ion-space-20) 0;
    background-color: inherit;
`


export class StandardDropDownListItemModel<TFieldValue> implements IStandardDropDownItemViewModel<TFieldValue> {
    constructor(private readonly id: TFieldValue, private readonly text: string) {
    }

    geDropDownValue(): TFieldValue {
        return this.id;
    }

    isSameAs(fieldValue: TFieldValue | null) {
        return this.id === fieldValue;
    }

    get key(): string {
        return this.id?.toString() ?? '';
    }

    applyFilter(filter: string): boolean {
        try {
            if(filter) {
                const regEx = new RegExp(filter, "gi");
                return Boolean(this.getDropDownDisplayText().match(regEx));
            } else {
                return false;
            }

        } catch (err) {
            console.error(`StandardDropDownListItemModel.applyFilter for ${filter} failed!`, err);
            return false;
        }

    }

    getDropDownDisplayText(): string {
        return this.text;
    }

    protected _renderItemContent(): string | React.ReactElement {
        return this.getDropDownDisplayText();
    }

    renderItem(options: IRenderStandardDropDownItemOptions): React.ReactElement {

        let Box: any = DropDownItemBox;
        if(options?.isRenderedInModalDialog) {
            Box = InsideModalDialogDropDownItemBox;
        }

        return (
            <Box $isCurrent={options.isCurrent} $isLast={options.isLast}>
                {this._renderItemContent()}
            </Box>
        )
    }
}
