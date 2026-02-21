import {ButtonBase, ButtonColors, ConcreteButtonProps} from "./button-base";
import React from "react";
import {observer} from "mobx-react-lite";



interface TertiaryButtonProps extends ConcreteButtonProps {
}

export const TertiaryButton: React.FC<TertiaryButtonProps> = observer((props) => {

    const buttonColors: ButtonColors = {
        $background: 'var(--ion-color-tertiary)',
        $color: 'var(--ion-color-tertiary-contrast)',
        $border: 'var(--ion-color-tertiary)',
        $backgroundActivated: 'var(--ion-color-tertiary-contrast)',
        $colorActivated: 'var(--ion-color-tertiary)',
        $borderActivated: 'var(--ion-color-tertiary)'
    }
    return (
        <ButtonBase {...props} colors={buttonColors}>
            {props.children}
        </ButtonBase>
    );
});
