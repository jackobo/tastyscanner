import React from "react";
import {observer} from "mobx-react";
import {IonItem} from "@ionic/react";
import styled, {css} from "styled-components";
import {useFrameworkServices} from "../../../hooks/use-framework-services.hook";
import {ISideMenuItemViewModel} from "../../../services/side-menu/left/models/side-menu-item.view-model.interface";

const MenuItemContainerBox = styled.div<{$showCursor: boolean}>`
    padding: 0;
    ${props => props.$showCursor && css`
        cursor: pointer;
    `}
   
`

const IonItemBox = styled(IonItem)<{$isSelected: boolean; $level: number}>`
    --padding-start: ${props => 16 + props.$level * 32}px;
    --padding-top: 0;
    --padding-bottom: 0;
    ${props => props.$isSelected && css`
        --background: rgba(var(--ion-color-primary-rgb), 0.14);
        --color: var(--ion-color-primary);
    `}

    &:hover {
        --background: var(--ion-color-light);
    }
`

const MenuItemContentBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 100%;
`


interface StandardSideMenuItemComponentProps {
   menuItem: ISideMenuItemViewModel;
   className?: string;
   level: number;
}
export const StandardSideMenuItemComponent: React.FC<StandardSideMenuItemComponentProps> = observer((props) => {
    const services = useFrameworkServices();


    const customMenu = props.menuItem.renderCustomMenu();
    if(customMenu) {
        return customMenu;
    }

    const level = props.level;

    const onClick = async () => {
        if(props.menuItem.shouldCloseMenuOnClick) {
            await services.leftSideMenu.close();
        }

        await props.menuItem.execute();

    }

    const renderIcon = () => {

        const icon = props.menuItem.renderIcon();
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
        <MenuItemContainerBox className={props.className} $showCursor={props.menuItem.shouldCloseMenuOnClick}>
            <IonItemBox $isSelected={props.menuItem.isSelected}
                        $level={level}
                        lines="none"
                        detail={false}
                        onClick={onClick}>
                {renderIcon()}
                <MenuItemContentBox>
                    {props.menuItem.renderStandardContent()}
                </MenuItemContentBox>
            </IonItemBox>
        </MenuItemContainerBox>
    )
})