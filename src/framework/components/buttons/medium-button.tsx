import {ButtonBase, ButtonColors, ConcreteButtonProps} from "./button-base";
import React from "react";
import {observer} from "mobx-react-lite";



interface MediumButtonProps extends ConcreteButtonProps {
}

export const MediumButton: React.FC<MediumButtonProps> = observer((props) => {

    const buttonColors: ButtonColors = {
        $background: 'var(--ion-color-dark-contrast)',
        $color: 'var(--ion-color-medium-shade)',
        $border: '#DBE0E9',
        $backgroundActivated: 'var(--ion-color-medium-shade)',
        $colorActivated: 'var(--ion-color-dark-contrast)',
        $borderActivated: 'var(--ion-color-medium-shade)'
    }

    return (
        <ButtonBase {...props} colors={buttonColors}>
            {props.children}
        </ButtonBase>
    );
});
