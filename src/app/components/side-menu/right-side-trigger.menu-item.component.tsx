import React from "react";
import {observer} from "mobx-react";
import {
    StandardSideMenuItemComponent
} from "../../../framework/components/side-menu/left/standard-side-menu-item.component";
import {
    IRightSideTriggerMenuItemViewModel
} from "../../services/side-menu/left/models/right-side-trigger.menu-item.view-model.interface";

export const RightSideTriggerMenuItemComponent: React.FC<{menuItem: IRightSideTriggerMenuItemViewModel}> = observer((props) => {
    return (
        <StandardSideMenuItemComponent renderIcon={() => props.menuItem.renderIcon()}
                                       renderContent={() => props.menuItem.renderMenuItemContent()}
                                       isSelected={() => false}
                                       onClick={() => props.menuItem.open()}/>
    )
})