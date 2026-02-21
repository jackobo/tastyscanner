import {ButtonBase, ButtonColors, ConcreteButtonProps} from "./button-base";
import React from "react";
import {observer} from "mobx-react-lite";



interface PrimaryButtonInvertedProps extends ConcreteButtonProps {
}

export const PrimaryButtonInverted: React.FC<PrimaryButtonInvertedProps> = observer((props) => {

    const buttonColors: ButtonColors = {
        $background: 'var(--ion-color-light)',
        $color: 'var(--ion-color-primary)',
        $border: 'var(--ion-color-primary)',
        $backgroundActivated: 'var(--ion-color-primary)',
        $colorActivated: 'var(--ion-color-light)',
        $borderActivated: 'var(--ion-color-primary)'
    }

    return (
        <ButtonBase {...props} colors={buttonColors}>
            {props.children}
        </ButtonBase>
    );
});
