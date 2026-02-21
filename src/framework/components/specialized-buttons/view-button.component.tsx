import React from "react";
import {observer} from "mobx-react";
import {SpecializedButtonComponent, SpecializedButtonComponentProps} from "./specialized-button.component";
import {IonIcon} from "@ionic/react";
import {eyeOutline} from "ionicons/icons";



interface ViewButtonComponentProps extends Omit<SpecializedButtonComponentProps, 'renderIcon'>{
}

export const ViewButtonComponent: React.FC<ViewButtonComponentProps> = observer((props) => {
    return (
        <SpecializedButtonComponent {...props}
                                    renderIcon={() => <IonIcon icon={eyeOutline} />}/>
    )
})