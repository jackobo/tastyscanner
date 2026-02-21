import React from "react";
import {observer} from "mobx-react";
import {
    IWatchListsSideMenuItemViewModel
} from "../../../services/side-menu/left/models/watch-lists/watch-lists.side-menu-item.view-model";
import {
    StandardSideMenuItemComponent
} from "../../../../framework/components/side-menu/left/standard-side-menu-item.component";
import {useServices} from "../../../hooks/use-services.hook";
import {IonIcon} from "@ionic/react";
import {eyeOutline} from "ionicons/icons";

export const WatchListsSideMenuItemComponent: React.FC<{menuItem: IWatchListsSideMenuItemViewModel}> = observer((props) => {
    const services = useServices();

    const onClick = async () => {
        await props.menuItem.open();
    }

    const renderIcon = () => {
        return (
            <IonIcon icon={eyeOutline}/>
        )
    }

    return (
        <StandardSideMenuItemComponent renderIcon={renderIcon}
                                       renderContent={() => services.language.translate('Watch lists')}
                                       isSelected={() => false}
                                       onClick={onClick}/>
    )
})