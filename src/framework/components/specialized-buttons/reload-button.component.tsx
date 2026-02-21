import React from "react";
import {observer} from "mobx-react";
import {SpecializedButtonComponent, SpecializedButtonComponentProps} from "./specialized-button.component";
import {IonIcon} from "@ionic/react";
import {reloadOutline} from "ionicons/icons";



interface ReloadButtonComponentProps extends Omit<SpecializedButtonComponentProps, 'renderIcon'>{
}

export const ReloadButtonComponent: React.FC<ReloadButtonComponentProps> = observer((props) => {
    return (
        <SpecializedButtonComponent {...props}
                                    renderIcon={() => <IonIcon icon={reloadOutline} />}/>
    )
})