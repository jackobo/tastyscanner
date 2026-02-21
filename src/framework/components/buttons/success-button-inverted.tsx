import {ButtonBase, ButtonColors, ConcreteButtonProps} from "./button-base";
import React from "react";
import {observer} from "mobx-react-lite";



interface SuccessButtonInvertedProps extends ConcreteButtonProps {
}

export const SuccessButtonInverted: React.FC<SuccessButtonInvertedProps> = observer((props) => {

    const buttonColors: ButtonColors = {
        $background: 'var(--ion-color-light)',
        $color: 'var(--ion-color-success)',
        $border: 'var(--ion-color-success)',
        $backgroundActivated: 'var(--ion-color-success)',
        $colorActivated: 'var(--ion-color-light)',
        $borderActivated: 'var(--ion-color-success)'
    }

    return (
        <ButtonBase {...props} colors={buttonColors}>
            {props.children}
        </ButtonBase>
    );
});
