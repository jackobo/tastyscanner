import {ButtonBase, ButtonColors, ConcreteButtonProps} from "./button-base";
import React from "react";
import {observer} from "mobx-react-lite";


interface PrimaryShadeButtonProps extends ConcreteButtonProps {
}

export const PrimaryShadeButton: React.FC<PrimaryShadeButtonProps> = observer((props) => {


    const buttonColors: ButtonColors = {
        $background: 'var(--ion-color-primary-shade)',
        $color: 'var(--ion-color-primary-contrast)',
        $border: 'var(--ion-color-primary-shade)',
        $backgroundActivated: 'var(--ion-color-primary-contrast)',
        $colorActivated: 'var(--ion-color-primary-shade)',
        $borderActivated: 'var(--ion-color-primary-shade)'
    }
    return (
        <ButtonBase {...props} colors={buttonColors}>
            {props.children}
        </ButtonBase>
    );
});
