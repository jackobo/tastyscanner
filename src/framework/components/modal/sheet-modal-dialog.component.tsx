import React, {KeyboardEvent, PropsWithChildren} from "react";
import {observer} from "mobx-react";
import {ISheetModalDialogRenderer} from "../../services/dialog/dialog.service.interface";
import {IonModal} from "@ionic/react";
import styled from "styled-components";

const IonModalBox = styled(IonModal)`
    --border-style: solid;
    --border-width: 1px;
    --border-color: var(--ion-color-medium);
    --border-radius: 8px;
    --backdrop-opacity: 0.8;
    &::part(backdrop){
      background-color: var(--ion-color-medium);
    }
`

interface SheetModalDialogComponentProps extends PropsWithChildren {
    renderer: ISheetModalDialogRenderer;
    backdropDismiss: boolean;
    breakpoints: number[];
    showHandle: boolean;
}

export const SheetModalDialogComponent: React.FC<SheetModalDialogComponentProps> = observer((props) => {

    const captureElementRef = (element: any) => {
        props.renderer.attachElementRef(element)
    }

    const onDismissHandler = () => {
        props.renderer.onBackdropDismiss();
    }

    const initialBreakpoint = props.breakpoints.find(b => b > 0); //first one that is not zero

    const keyDownEventHandler = (event: KeyboardEvent<HTMLIonModalElement>) => {
        if(event.key === "Escape") {
            props.renderer.onEscapeKeyPressed();
        }
    }


    return (
        <IonModalBox key={props.renderer.id}
                     id={props.renderer.id}
                     ref={captureElementRef}
                     isOpen={props.renderer.isOpen}
                     keyboardClose={false}
                     showBackdrop={true}
                     handle={props.showHandle}
                     backdropDismiss={props.backdropDismiss}
                     onDidDismiss={onDismissHandler}
                     breakpoints={props.breakpoints}
                     initialBreakpoint={initialBreakpoint}
                     onKeyDown={keyDownEventHandler}>
            {props.children}
        </IonModalBox>
    )
});
