import React, {MouseEvent} from "react";
import {observer} from "mobx-react";
import {InputContainerComponent} from "./input-container/input-container.component";
import {FieldInputContainerComponentProps, InputContainerComponentProps} from "./inputs-common.props";

export const FieldInputContainerComponent: React.FC<FieldInputContainerComponentProps> = observer(props => {

    const {field, forceClearButton, ...otherProps} = props;

    if(field.isHidden) {
        return null;
    }

    const captureInputContainerElementRef = (element: HTMLDivElement) => {
        field.attachContainerDOMElement(element);
        if(props.captureInputContainerRef) {
            props.captureInputContainerRef(element);
        }
    }

    const renderLabel = () => {
        if(props.renderLabel) {
            const renderLabel = props.renderLabel;
            return () => renderLabel();
        }

        return () => field.fieldName;
    }

    const onClearButtonClick = (event: MouseEvent<HTMLDivElement>) => {
        if(props.onClearButtonClick) {
            props.onClearButtonClick(event);
        }

        if(event.isDefaultPrevented() || event.isPropagationStopped()) {
            return;
        }

        field.clear();
        field.setFocus({noScroll: true});
    }

    const inputContainerProps: InputContainerComponentProps = {
        ...otherProps,
        captureInputContainerRef: captureInputContainerElementRef,
        renderLabel: renderLabel(),
        errorMessage: field.activatedError,
        showClearButton: (props.showClearButton && Boolean(field.value)) || Boolean(forceClearButton),
        onClearButtonClick: onClearButtonClick
    }

    return (
        <InputContainerComponent {...inputContainerProps}/>
    )
});
