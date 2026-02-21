import {ButtonBase, ButtonColors, ConcreteButtonProps} from "./button-base";
import React from "react";
import {observer} from "mobx-react-lite";

interface NeutralButtonProps extends ConcreteButtonProps {
}

export const NeutralButton: React.FC<NeutralButtonProps> = observer((props) => {


    const buttonColors: ButtonColors = {
        $background: 'var(--ion-color-dark-contrast)',
        $color: 'var(--ion-color-dark)',
        $border: 'var(--ion-color-dark)',
        $backgroundActivated: 'var(--ion-color-dark)',
        $colorActivated: 'var(--ion-color-dark-contrast)',
        $borderActivated: 'var(--ion-color-dark)'
    }

    return (
        <ButtonBase {...props} colors={buttonColors}>
            {props.children}
        </ButtonBase>
    );
});
