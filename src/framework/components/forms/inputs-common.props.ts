import React, {MouseEvent} from "react";
import {InputLabelRendererType} from "./input-label-renderer.type";
import {InputIconRendererType} from "./input-icon-renderer.type";
import {NullableString} from "../../types/nullable-types";
import {IFormField} from "../../models/forms/form-field.interface";

export type InputContainerStyle = 'outsideBorder' | 'insideBorder';

export interface InputContainerComponentProps {
    /**
     * insideBorder: Both the label and the input are drawn inside the borders.
     * outsideBorder: Only the input is drawn inside the borders.
     */
    inputStyle?: InputContainerStyle;
    renderInput: (hasError: boolean) => React.ReactElement;
    hideLabel?: boolean;
    renderLabel?: InputLabelRendererType;
    renderIcon?: InputIconRendererType;
    errorMessage?: NullableString;
    hideErrorMessage?: boolean;
    captureInputContainerRef?: (element: HTMLDivElement) => void;
    captureInputRef?: (element: HTMLDivElement) => void;
    onClick?: () => void;
    className?: string;
    cssClasses?: InputContainerCommonCssClasses;
    cssClassesForOutsideBordersStyle?: InputContainerCssClassesForOutsideBordersStyle;
    cssClassesForInsideBorders?: InputContainerCssClassesForInsideBorders;
    isReadonly?: boolean;
    showClearButton?: boolean;
    onClearButtonClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

export interface FieldInputContainerComponentProps extends Omit<InputContainerComponentProps, 'errorMessage'> {
    field: IFormField;
    forceClearButton?: boolean;
}

export interface FieldEditorCommonProps extends Omit<FieldInputContainerComponentProps, 'field' | 'renderInput'> {
}

export interface InputContainerCommonCssClasses {
    inputContainer?: string;
    labelContainer?: string;
    iconContainer?: string;
    errorContainer?: string;
}

export interface InputContainerCssClassesForOutsideBordersStyle {
    contentSectionContainer?: string;
    inputAndIconContainer?: string;
}

export interface InputContainerCssClassesForInsideBorders {
    contentSectionContainer?: string;
}