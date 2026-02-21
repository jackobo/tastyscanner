import {ButtonBase, ButtonColors, ConcreteButtonProps} from "./button-base";
import React from "react";
import {observer} from "mobx-react-lite";


interface PrimaryShadeButtonInvertedProps extends ConcreteButtonProps {
}

export const PrimaryShadeButtonInverted: React.FC<PrimaryShadeButtonInvertedProps> = observer((props) => {

    const buttonColors: ButtonColors = {
        $background: 'var(--ion-color-light)',
        $color: 'var(--ion-color-primary-shade)',
        $border: 'var(--ion-color-primary-shade)',
        $backgroundActivated: 'var(--ion-color-primary-shade)',
        $colorActivated: 'var(--ion-color-light)',
        $borderActivated: 'var(--ion-color-primary-shade)'
    }
    return (
        <ButtonBase {...props} colors={buttonColors}>
            {props.children}
        </ButtonBase>
    );
});
