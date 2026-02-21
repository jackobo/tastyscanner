import React from "react";
import {observer} from "mobx-react";
import {
    StandardSideMenuItemComponent
} from "../../../framework/components/side-menu/left/standard-side-menu-item.component";
import {
    IRightSideTriggerMenuItemViewModel
} from "../../services/side-menu/left/models/right-side-trigger.menu-item.view-model.interface";
import styled from "styled-components";
import {IonIcon} from "@ionic/react";
import {checkmarkOutline} from "ionicons/icons";

const MenuItemContentContainerBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
`

const MenuItemMainContentBox = styled.div`
    flex-grow: 1;
`

const CheckIconBox = styled.div`
    color: var(--ion-color-success-shade);
`


export const RightSideTriggerMenuItemComponent: React.FC<{menuItem: IRightSideTriggerMenuItemViewModel}> = observer((props) => {

    const renderCheckIcon = () => {
        if(!props.menuItem.isOpen) {
            return null;
        }

        return (
            <CheckIconBox>
                <IonIcon icon={checkmarkOutline}/>
            </CheckIconBox>
        )
    }

    const renderContent = () => {
        return (
            <MenuItemContentContainerBox>
                <MenuItemMainContentBox>
                    {props.menuItem.renderMenuItemContent()}
                </MenuItemMainContentBox>
                {renderCheckIcon()}
            </MenuItemContentContainerBox>
        )
    }

    return (
        <StandardSideMenuItemComponent renderIcon={() => props.menuItem.renderIcon()}
                                       renderContent={renderContent}
                                       isSelected={() => false}
                                       onClick={() => props.menuItem.open()}/>
    )
})