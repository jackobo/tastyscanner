import {SpecializedButtonComponent, SpecializedButtonComponentProps} from "./specialized-button.component";
import React from "react";
import {observer} from "mobx-react";
import {IonIcon} from "@ionic/react";
import {addOutline} from "ionicons/icons";

interface AddButtonComponentProps extends Omit<SpecializedButtonComponentProps, 'renderIcon'>{

}

export const AddButtonComponent: React.FC<AddButtonComponentProps> = observer((props) => {
    return (
        <SpecializedButtonComponent inverted={true}
                                    {...props}
                                    renderIcon={() => <IonIcon icon={addOutline} />}/>
)
})