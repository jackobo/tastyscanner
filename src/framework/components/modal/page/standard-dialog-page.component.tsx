import React, {PropsWithChildren} from "react";
import {observer} from "mobx-react";
import {IonPage} from "@ionic/react";

export const StandardDialogPageComponent: React.FC<PropsWithChildren> = observer((props) => {
    return (
        <IonPage>
            {props.children}
        </IonPage>
    );
});
