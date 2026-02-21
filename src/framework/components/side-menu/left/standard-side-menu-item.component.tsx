import React from "react";
import {observer} from "mobx-react";
import {IonItem, IonLabel, IonMenuToggle} from "@ionic/react";
import styled, {css} from "styled-components";

const IonMenuToggleBox = styled(IonMenuToggle)<{$showCursor: boolean}>`
    ${props => props.$showCursor && css`
        cursor: pointer;
    `}
   
`

const IonItemBox = styled(IonItem)<{$isSelected: boolean; $level: number}>`
    
    ${props => props.$isSelected && css`
        --background: rgba(var(--ion-color-primary-rgb), 0.14);
        --color: var(--ion-color-primary);
    `}

    --padding-start: ${props => 16 + props.$level * 32}px;
    &:hover {
        --background: var(--ion-color-light);
    }
`


interface StandardSideMenuItemComponentProps {
   renderContent: () => React.ReactElement | string;
   renderIcon?: () => React.ReactElement | null;
   isSelected: () => boolean;
   onClick?: () => Promise<void>;
   className?: string;
   level?: () => number;
}
export const StandardSideMenuItemComponent: React.FC<StandardSideMenuItemComponentProps> = observer((props) => {

    let level = 0;
    if(props.level) {
        level = props.level();
    }

    const onClick = async () => {
        if(props.onClick) {
            await props.onClick();
        }

    }

    const renderIcon = () => {
        if(!props.renderIcon) {
            return null;
        }
        const icon = props.renderIcon();
        if(!icon) {
            return null;
        }
        return (
            <div slot={"start"}>
                {icon}
            </div>
        )
    }

    return (
        <IonMenuToggleBox autoHide={false} className={props.className} $showCursor={!!props.onClick}>
            <IonItemBox $isSelected={props.isSelected()}
                        $level={level}
                        lines="none"
                        detail={false}
                        onClick={onClick}>
                {renderIcon()}
                <IonLabel>
                    {props.renderContent()}
                </IonLabel>
            </IonItemBox>
        </IonMenuToggleBox>
    )
})