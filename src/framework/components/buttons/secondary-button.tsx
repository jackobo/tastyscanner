import React from "react";
import {ButtonBase, ButtonColors, ConcreteButtonProps} from "./button-base";

import {observer} from "mobx-react-lite";

interface SecondaryButtonProps extends ConcreteButtonProps {
}
export const SecondaryButton: React.FC<SecondaryButtonProps> = observer((props) => {

    const buttonColors: ButtonColors = {
        $background: 'var(--ion-color-secondary)',
        $color: 'var(--ion-color-secondary-contrast)',
        $border: 'var(--ion-color-secondary)',
        $backgroundActivated: 'var(--ion-color-secondary-contrast)',
        $colorActivated: 'var(--ion-color-secondary)',
        $borderActivated: 'var(--ion-color-secondary)'
    }
    return (
        <ButtonBase {...props} colors={buttonColors}>
            {props.children}
        </ButtonBase>
    );
});
