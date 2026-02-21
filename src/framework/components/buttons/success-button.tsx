import {ButtonBase, ButtonColors, ConcreteButtonProps} from "./button-base";
import React from "react";
import {observer} from "mobx-react-lite";



interface SuccessButtonProps extends ConcreteButtonProps {
}

export const SuccessButton: React.FC<SuccessButtonProps> = observer((props) => {

    const buttonColors: ButtonColors = {
        $background: 'var(--ion-color-success)',
        $color: 'var(--ion-color-success-contrast)',
        $border: 'var(--ion-color-success)',
        $backgroundActivated: 'var(--ion-color-success-contrast)',
        $colorActivated: 'var(--ion-color-success)',
        $borderActivated: 'var(--ion-color-success)'
    }
    return (
        <ButtonBase {...props} colors={buttonColors}>
            {props.children}
        </ButtonBase>
    );
});
