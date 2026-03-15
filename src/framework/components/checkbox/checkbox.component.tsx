import React, {CSSProperties} from "react";
import {observer} from "mobx-react-lite";
import styled, {css} from "styled-components";
import {IonIcon} from "@ionic/react";
import {checkmarkCircleOutline, radioButtonOffOutline} from "ionicons/icons";

const ContainerBox = styled.div<{$isReadOnly: boolean}>`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--ion-space-8);
    cursor: ${props => props.$isReadOnly ? 'not-allowed' : 'pointer'};
    
`


const CheckIconBox = styled.div<{$isChecked: boolean}>`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    justify-items: center;
    font-size: 24px;
    background-color: transparent;
    
    ${props => props.$isChecked 
            ? css`
                color: var(--ion-color-success);
            `
            : css`
                color: var(--ion-color-dark);
            `
    }
`

export type CheckBoxLabelPlacement = 'start' | 'end' | 'stacked';

interface CheckboxComponentProps {
    className?: string;
    checked: boolean;
    onChange?: (isChecked: boolean) => void;
    //onClick?: (event: MouseEvent<HTMLElement>) => void;
    disabled?: boolean;
    label?: string | React.ReactElement;
    labelPlacement?: CheckBoxLabelPlacement;
    isReadOnly?: boolean;
}

export const CheckboxComponent: React.FC<CheckboxComponentProps> = observer((props) => {
    const isChecked = props.checked;
    const isReadOnly = Boolean(props.isReadOnly || props.disabled);

    //event: MouseEvent<HTMLElement>
    const onClickHandler = () => {
        if(isReadOnly) {
            return;
        }
/*
        if(props.onClick) {
            props.onClick(event);
        }
*/

        if(props.onChange) {
            props.onChange(!isChecked);
        }
    }

    const renderCheckIcon = () => {
        if(isChecked) {
            return (
                <IonIcon icon={checkmarkCircleOutline}/>
            )
        } else {
            return (
                <IonIcon icon={radioButtonOffOutline}/>
            )
        }
    }

    const containerCSSProps: CSSProperties = {};

    switch (props.labelPlacement) {
        case "start":
            containerCSSProps.flexDirection = "row-reverse";
            break;
        case "stacked":
            containerCSSProps.flexDirection = "column";
            break;
    }

    return (
        <ContainerBox $isReadOnly={isReadOnly}
                      className={props.className}
                      onClick={onClickHandler}
                      style={containerCSSProps}>
            <CheckIconBox $isChecked={isChecked}>
                {renderCheckIcon()}
            </CheckIconBox>
            <div>
                {props.label}
            </div>
        </ContainerBox>

    )
});
