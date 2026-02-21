import {SpecializedButtonComponent, SpecializedButtonComponentProps} from "./specialized-button.component";
import React from "react";
import {observer} from "mobx-react";
import {IonIcon} from "@ionic/react";
import {copyOutline} from "ionicons/icons";

interface CloneButtonComponentProps extends Omit<SpecializedButtonComponentProps, 'renderIcon'>{

}

export const CloneButtonComponent: React.FC<CloneButtonComponentProps> = observer((props) => {
    return (
        <SpecializedButtonComponent {...props}
                                    renderIcon={() => <IonIcon icon={copyOutline} />}/>
)
})