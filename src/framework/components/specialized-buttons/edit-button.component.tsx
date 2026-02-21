import React from "react";
import {observer} from "mobx-react";
import {SpecializedButtonComponent, SpecializedButtonComponentProps} from "./specialized-button.component";
import {IonIcon} from "@ionic/react";
import {createOutline} from "ionicons/icons";



interface EditButtonComponentProps extends Omit<SpecializedButtonComponentProps, 'renderIcon'>{
}

export const EditButtonComponent: React.FC<EditButtonComponentProps> = observer((props) => {
    return (
        <SpecializedButtonComponent {...props}
                                    renderIcon={() => <IonIcon icon={createOutline} />}/>
    )
})