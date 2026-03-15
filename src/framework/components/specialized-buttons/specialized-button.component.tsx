import React, {useRef} from "react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {TooltipComponent, TooltipToggleBehaviorEnum} from "../tooltip/tooltip.component";
import {SpecializeButtonColor} from "./specialize-button-color";
import {SpecializeButtonSize} from "./specialize-button-size";

const ContainerBox = styled.div<{$backColor: string; $color: string; $fontSize: string}>`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: ${props => props.$backColor};
    color: ${props => props.$color};
    font-size: ${props => props.$fontSize};
    padding: var(--ion-space-8);
    border-radius: 50%;
`

const ToolTipTextBox = styled.div`
    padding: var(--ion-space-16);
    font-size: var(--ion-font-size-body2);
    line-height: 1.3;
`

const FONT_SIZES: Record<SpecializeButtonSize, string> = {
    small: '16px',
    medium: '20px',
    large: '24px',
    extraLarge: '28px'
}

const COLORS: Record<SpecializeButtonColor, {color: string; backColor: string}> = {
    primary: {color: 'var(--ion-color-primary)', backColor: 'var(--ion-color-primary-contrast)'},
    secondary: {color: 'var(--ion-color-secondary)', backColor: 'var(--ion-color-secondary-contrast)'},
    tertiary: {color: 'var(--ion-color-tertiary)', backColor: 'var(--ion-color-tertiary-contrast)'},
    warning: {color: 'var(--ion-color-warning)', backColor: 'var(--ion-color-warning-contrast)'},
    danger: {color: 'var(--ion-color-danger)', backColor: 'var(--ion-color-danger-contrast)'},
    success: {color: 'var(--ion-color-success)', backColor: 'var(--ion-color-success-contrast)'},
    dark: {color: 'var(--ion-color-dark)', backColor: 'var(--ion-color-dark-contrast)'},
}
export interface SpecializedButtonComponentProps {
    renderIcon: () => React.ReactElement;
    onClick: () => void;
    tooltipText?: string;
    className?: string;
    color?: SpecializeButtonColor;
    inverted?: boolean;
    size?: SpecializeButtonSize;

}
export const SpecializedButtonComponent: React.FC<SpecializedButtonComponentProps> = observer((props) =>{
    const toolTipButtonRef = useRef<HTMLDivElement | null>(null);

    let {backColor, color} = COLORS[props.color || 'primary'];

    if(props.inverted) {
        const temp = backColor;
        backColor = color;
        color = temp;
    } else {
        backColor = 'transparent';
    }

    const fontSize = FONT_SIZES[props.size || 'medium'];

    const renderTooltip = () => {
        if(!props.tooltipText) {
            return null;
        }

        return (
            <TooltipComponent targetRef={toolTipButtonRef}
                              placement={"bottom"}
                              toggleBehavior={TooltipToggleBehaviorEnum.OnTargetMouseEnterLeave}
                              showCloseButton={false}>
                <ToolTipTextBox>{props.tooltipText}</ToolTipTextBox>
            </TooltipComponent>
        )
    }

    return (
        <>
            <ContainerBox ref={toolTipButtonRef}
                          className={props.className}
                          onClick={props.onClick}
                          $backColor={backColor}
                          $color={color}
                          $fontSize={fontSize}>
                {props.renderIcon()}
            </ContainerBox>
            {renderTooltip()}
        </>

    )
})