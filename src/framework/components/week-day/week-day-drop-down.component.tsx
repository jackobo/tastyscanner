import React from "react";
import {observer} from "mobx-react";
import {IFormField} from "../../models/forms/form-field.interface";
import {
    StandardDropDownListItemModel
} from "../forms/standard-drop-down/list-view/models/item/standard-drop-down-list-item.model";
import {StandardDropDownComponent} from "../forms/standard-drop-down/standard-drop-down.component";
import {useFrameworkServices} from "../../hooks/use-framework-services.hook";

interface WeekDayDropDownComponentProps {
    field: IFormField<number>;
}

export const WeekDayDropDownComponent: React.FC<WeekDayDropDownComponentProps> = observer((props) => {
    const services = useFrameworkServices();
    const items: StandardDropDownListItemModel<number>[] = services.time.getWeekDays().map(wd => new StandardDropDownListItemModel<number>(wd.id, wd.name));
    return (
        <StandardDropDownComponent field={props.field} items={items}/>
    )
})