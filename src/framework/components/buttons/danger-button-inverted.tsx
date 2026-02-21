import {ButtonBase, ButtonColors, ConcreteButtonProps} from "./button-base";
import React from "react";
import {observer} from "mobx-react-lite";



interface DangerButtonInvertedProps extends ConcreteButtonProps {
}

export const DangerButtonInverted: React.FC<DangerButtonInvertedProps> = observer((props) => {

    const buttonColors: ButtonColors = {
        $background: 'var(--ion-color-light)',
        $color: 'var(--ion-color-danger)',
        $border: 'var(--ion-color-danger)',
        $backgroundActivated: 'var(--ion-color-danger)',
        $colorActivated: 'var(--ion-color-light)',
        $borderActivated: 'var(--ion-color-danger)'
    }

    return (
        <ButtonBase {...props} colors={buttonColors}>
            {props.children}
        </ButtonBase>
    );
});
