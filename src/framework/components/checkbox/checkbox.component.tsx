import React, {MouseEvent} from "react";
import {observer} from "mobx-react-lite";
import styled from "styled-components";
import {IonCheckbox} from "@ionic/react";

const CheckBox = styled(IonCheckbox)<{isDisplayedInTheHeader?: boolean;}>`
  --size: 22px;
  --border-width: 2px;
  --border-color: var(--ion-color-dark);
  --border-color-checked: var(--ion-color-primary);
    z-index: 0;
    && {
        --checkbox-background: transparent;
    }

    --checkbox-background: var(--ion-color-primary-contrast);
    --checkbox-background-checked: var(--ion-color-primary);
    --checkmark-color: var(--ion-color-primary-contrast);
  
   
`

export type CheckBoxLabelPlacement = 'start' | 'end' | 'fixed' | 'stacked';

interface CheckboxComponentProps {
    isDisplayedInTheHeader?: boolean;
    className?: string;
    checked: boolean;
    onChange?: (isChecked: boolean) => void;
    onClick?: (event: MouseEvent<HTMLElement>) => void;
    disabled?: boolean;
    label?: string | React.ReactElement;
    labelPlacement?: CheckBoxLabelPlacement;
    isReadOnly?: boolean;
    mode?: "ios" | "md";
}

export const CheckboxComponent: React.FC<CheckboxComponentProps> = observer((props) => {
    const onClickHandler = (event: MouseEvent<HTMLElement>) => {
        if(props.isReadOnly) {
            event.preventDefault();
        }

        if(props.onClick) {
            props.onClick(event);
        }

    }

    return (

        <CheckBox mode={props.mode ?? "ios"}
                  isDisplayedInTheHeader={props.isDisplayedInTheHeader}
                  className={props.className}
                  checked={props.checked}
                  onIonChange={e => {
                      if(props.isReadOnly) {
                          e.preventDefault();
                          e.stopPropagation();
                      } else if(props.onChange){
                          props.onChange(e.detail.checked)
                      }
                  }}
                  onClick={onClickHandler}
                  disabled={props.disabled}
                  labelPlacement={props.labelPlacement}>
            {props.label}

        </CheckBox>
    )
});
