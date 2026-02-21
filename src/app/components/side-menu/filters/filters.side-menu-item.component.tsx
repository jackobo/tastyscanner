import React from "react";
import {observer} from "mobx-react";
import {
    StandardSideMenuItemComponent
} from "../../../../framework/components/side-menu/left/standard-side-menu-item.component";
import {useServices} from "../../../hooks/use-services.hook";
import {
    IFiltersSideMenuItemViewModel
} from "../../../services/side-menu/left/models/filters/filters.side-menu-item.view-model.interface";
import {IonIcon} from "@ionic/react";
import {filterOutline} from "ionicons/icons";

export const FiltersSideMenuItemComponent: React.FC<{menuItem: IFiltersSideMenuItemViewModel}> = observer((props) => {
    const services = useServices();
    const onClick = async  () => {
        await props.menuItem.open();
    }

    const renderIcon = () => {
        return (
            <IonIcon icon={filterOutline}/>
        )
    }

    return (
        <StandardSideMenuItemComponent renderIcon={renderIcon}
                                       renderContent={() => services.language.translate('Strategies filters')}
                                       isSelected={() => false}
                                       onClick={onClick}/>
    )
})