import React from "react";
import {observer} from "mobx-react";
import {useServices} from "../../hooks/use-services.hook";
import {
    StandardDropDownListItemModel
} from "../../../framework/components/forms/standard-drop-down/list-view/models/item/standard-drop-down-list-item.model";
import {
    StandardDropDownComponent
} from "../../../framework/components/forms/standard-drop-down/standard-drop-down.component";
import {IFormField} from "../../../framework/models/forms/form-field.interface";


interface BrokerageAccountDropDownComponentProps {
    field: IFormField<string>;
}

export const BrokerageAccountDropDownComponent: React.FC<BrokerageAccountDropDownComponentProps> = observer((props) => {
    const services = useServices()
    const items = services.brokerageAccount.accounts.map(acc => new StandardDropDownListItemModel(acc.accountNumber, acc.accountNumber));

    return (
        <StandardDropDownComponent field={props.field} items={items}/>
    )
})