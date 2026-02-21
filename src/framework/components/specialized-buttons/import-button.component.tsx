import {SpecializedButtonComponent, SpecializedButtonComponentProps} from "./specialized-button.component";
import React from "react";
import {observer} from "mobx-react";
import {IonIcon} from "@ionic/react";
import {arrowDownCircle} from "ionicons/icons";

interface ImportButtonComponentProps extends Omit<SpecializedButtonComponentProps, 'renderIcon'>{

}

export const ImportButtonComponent: React.FC<ImportButtonComponentProps> = observer((props) => {
    return (
        <SpecializedButtonComponent color={'tertiary'} inverted={true} {...props}
                                    renderIcon={() => <IonIcon icon={arrowDownCircle} />}/>
)
})