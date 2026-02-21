import {ButtonBase, ButtonColors, ConcreteButtonProps} from "./button-base";
import React from "react";
import {observer} from "mobx-react-lite";



interface DangerButtonProps extends ConcreteButtonProps {
}

export const DangerButton: React.FC<DangerButtonProps> = observer((props) => {

    const buttonColors: ButtonColors = {
        $background: 'var(--ion-color-danger)',
        $color: 'var(--ion-color-danger-contrast)',
        $border: 'var(--ion-color-danger)',
        $backgroundActivated: 'var(--ion-color-danger-contrast)',
        $colorActivated: 'var(--ion-color-danger)',
        $borderActivated: 'var(--ion-color-danger)'
    }
    return (
        <ButtonBase {...props} colors={buttonColors}>
            {props.children}
        </ButtonBase>
    );
});
