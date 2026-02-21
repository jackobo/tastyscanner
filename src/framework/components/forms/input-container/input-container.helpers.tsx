import React from "react";
import {InputContainerComponentProps} from "../inputs-common.props";

export function renderInputError(props: InputContainerComponentProps, Box: any) {
    const hasError = Boolean(props.errorMessage);

    if(!hasError || props.hideErrorMessage) {
        return null;
    }
    return (
        <Box className={props.cssClasses?.errorContainer}>
            {props.errorMessage}
        </Box>
    );
}

export function renderInputLabel(props: InputContainerComponentProps, Box: any) {
    if(props.hideLabel) {
        return null;
    }
    if(!props.renderLabel) {
        return null;
    }

    const label = props.renderLabel();

    if(!label) {
        return null;
    }

    return (
        <Box className={props.cssClasses?.labelContainer}>
            {label}
        </Box>
    );
}


export function renderInputIcon(props: InputContainerComponentProps, Box: any) {
    const icon = props.renderIcon && props.renderIcon();
    if(icon) {
        return (
            <Box className={props.cssClasses?.iconContainer}>
                {icon}
            </Box>
        );
    }
    return null;
}


