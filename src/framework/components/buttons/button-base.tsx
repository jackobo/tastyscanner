import styled, {css} from "styled-components";
import React, {MouseEvent, PropsWithChildren, useRef, useState} from "react";
import {observer} from "mobx-react";
import {arrowForwardOutline} from "ionicons/icons";
import {IonIcon} from "@ionic/react";
import {TooltipComponent} from "../tooltip/tooltip.component";
import {Placement} from "@popperjs/core";
import {Check} from "../../utils/type-checking";
import {TooltipStandardContentBox} from "../tooltip/tooltip-standard-content.box";
import {TooltipToggleBehaviorEnum} from "../tooltip/tooltip-toggle-behavior.enum";



export interface ButtonColors {
    $background: string;
    $color: string;
    $border: string;
    $backgroundActivated: string;
    $colorActivated: string;
    $borderActivated: string;
}

interface ButtonBaseBoxProps extends PropsWithChildren {
    $fullWidth: boolean;
    $colors: ButtonColors;
    $isPressed: boolean;
    $disabled?: boolean;
    $inactive?: boolean;
    $hasArrow?: boolean
}



function computeButtonColors(props: ButtonBaseBoxProps) {
    if(props.$disabled || props.$inactive) {
        return css`
                      background-color: var(--ion-color-light-shade);
                      color: #FFFFFF;
                      border-color: var(--ion-color-light-shade);
                  `;
    }

    if(props.$disabled) {
        return css`
                      cursor: not-allowed;
                  `;
    }

    if(props.$isPressed) {
        return  css`
                      background-color: ${props.$colors.$backgroundActivated};
                      color: ${props.$colors.$colorActivated};
                      border-color: ${props.$colors.$borderActivated};
                    `;
    }

    return css`
              background-color: ${props.$colors.$background};
              color: ${props.$colors.$color};
              border-color: ${props.$colors.$border};
            `
}


const ButtonBaseBox = styled.button<ButtonBaseBoxProps>`
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0.8rem 1.3rem;
    border-width: 1px;
    border-style: solid;
    border-radius: 8px;
    font-size: var(--ion-font-size-h5);
    font-weight: var(--ion-font-weight-semibold);
    height: auto;
    text-transform: none;
    white-space: normal;
    cursor: pointer;
    outline: none;
    ${props => computeButtonColors(props)}
    
    
    ${
            props => props.$fullWidth
                    ? css`
                      width: 100%;
                    `
                    : ''
    };

    ${
            props => props.$hasArrow
                    ? css`
                        justify-content: space-between;
                        gap: 0.75rem;
                    `
                    : css`
                        justify-content: center;
                    `
    };
    
`

const ArrowBox = styled.span`
    margin-bottom: -4px;
`

export interface ButtonTooltipProps {
    renderTooltipContent: () => React.ReactElement | string | null | undefined;
    placement?: Placement;
    toggleBehavior?: TooltipToggleBehaviorEnum;
    showCloseButton?: boolean;
    hideArrow?: boolean;
}

export interface ButtonBaseProps extends PropsWithChildren {
    className?: string;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    inactive?: boolean;
    fullWidth?: boolean;
    colors: ButtonColors;
    showArrow?: boolean;
    tooltip?: ButtonTooltipProps;
}


export interface ConcreteButtonProps extends Omit<ButtonBaseProps, 'colors'> {

}

export const ButtonBase: React.FC<ButtonBaseProps> = observer((props) => {
    const [isPressed, setIsPressed] = useState(false);
    const buttonRef = useRef<HTMLButtonElement | null>(null)

    const fullWidth = props.fullWidth ?? false;

    const onTouchStart = () => {
        setIsPressed(true);
    }

    const onTouchEnd = () => {
        setIsPressed(false)
    }

    const onClick = (event: MouseEvent<HTMLButtonElement>) => {
        if(props.disabled) {
            return;
        }

        if(props.onClick) {
            props.onClick(event);
        }
    }

    const renderArrow = () => {
        if(props.showArrow) {
            return (
                <ArrowBox>
                    <IonIcon icon={arrowForwardOutline}/>
                </ArrowBox>
            )
        }
        return null;
    }

    const renderToolTipStringContent = (toolTipContent: any) => {
        if(Check.isString(toolTipContent)) {
            return (
                <TooltipStandardContentBox>{toolTipContent}</TooltipStandardContentBox>
            )
        }

        return toolTipContent;
    }

    const renderToolTip = () => {
        if(!props.tooltip) {
            return null;
        }

        const toolTipContent = props.tooltip.renderTooltipContent();
        if(!toolTipContent) {
            return null;
        }

        return (
            <TooltipComponent targetRef={buttonRef}
                              placement={props.tooltip.placement ?? "bottom"}
                              toggleBehavior={props.tooltip.toggleBehavior}
                              showCloseButton={props.tooltip.showCloseButton}
                              hideArrow={props.tooltip.hideArrow}>
                {renderToolTipStringContent(toolTipContent)}
            </TooltipComponent>
        )
    }

    return (
      <>
          <ButtonBaseBox $fullWidth={fullWidth}
                         $disabled={props.disabled}
                         $inactive={props.inactive}
                         className={props.className}
                         onClick={onClick}
                         onMouseDown={onTouchStart}
                         onTouchStart={onTouchStart}
                         onTouchEnd={onTouchEnd}
                         onMouseUp={onTouchEnd}
                         $isPressed={isPressed}
                         $colors={props.colors}
                         $hasArrow={props.showArrow}
                         ref={buttonRef}>
              {props.children}
              {renderArrow()}
          </ButtonBaseBox>
          {renderToolTip()}
      </>
    )
})

