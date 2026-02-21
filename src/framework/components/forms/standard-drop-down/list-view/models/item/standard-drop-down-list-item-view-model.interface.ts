import React from 'react';

export interface IRenderStandardDropDownItemOptions {
    isRenderedInModalDialog?: boolean;
    isCurrent: boolean;
    isPrevious: boolean;
    isLast: boolean;
}

export interface IStandardDropDownItemViewModel<TFieldValue> {
    readonly key: string;
    geDropDownValue(): TFieldValue;
    isSameAs(fieldValue: TFieldValue | null): boolean;
    applyFilter(filter: string): boolean;
    renderItem(options: IRenderStandardDropDownItemOptions): React.ReactElement;

    /**
     * The text to be displayed in the drop down input area when the item is the selected one.
     * Also the return value of this method is used as the placeholder text for the drop down input
     * when the user opens the drop down.
     */
    getDropDownDisplayText(): string;
}


