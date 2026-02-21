import {ButtonBase, ButtonColors, ConcreteButtonProps} from "./button-base";
import React from "react";
import {observer} from "mobx-react-lite";



interface PrimaryButtonProps extends ConcreteButtonProps {
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = observer((props) => {

    const buttonColors: ButtonColors = {
        $background: 'var(--ion-color-primary)',
        $color: 'var(--ion-color-primary-contrast)',
        $border: 'var(--ion-color-primary)',
        $backgroundActivated: 'var(--ion-color-primary-contrast)',
        $colorActivated: 'var(--ion-color-primary)',
        $borderActivated: 'var(--ion-color-primary)'
    }
    return (
        <ButtonBase {...props} colors={buttonColors}>
            {props.children}
        </ButtonBase>
    );
});
