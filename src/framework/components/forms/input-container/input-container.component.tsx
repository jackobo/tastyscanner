import React from "react";
import {observer} from "mobx-react";
import {InputContainerInsideBordersStyleComponent} from "./input-container-inside-borders-style.component";
import {InputContainerOutsideBordersStyleComponent} from "./input-container-outside-borders-style.component";
import {InputContainerComponentProps} from "../inputs-common.props";

export const InputContainerComponent: React.FC<InputContainerComponentProps> = observer((props) => {
    const {inputStyle, ...otherProps} = props;

    if(inputStyle === "insideBorder") {
        return (
            <InputContainerInsideBordersStyleComponent {...otherProps}/>
        );
    } else {
        return (
            <InputContainerOutsideBordersStyleComponent  {...otherProps}/>
        );

    }



})
