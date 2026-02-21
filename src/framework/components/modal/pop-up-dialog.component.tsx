import React, {PropsWithChildren,  KeyboardEvent} from "react";
import {observer} from "mobx-react";
import styled, {css} from "styled-components";
import {IonModal} from "@ionic/react";
import {
    IPopupDialogRenderer,
} from "../../services/dialog/dialog.service.interface";

const MAX_ALLOWED_HEIGHT = '98%';

interface IonModalBoxProps {
    height: string;
    maxHeight: string;
    width?: string;
}



const IonModalBox = styled(IonModal)<IonModalBoxProps>`
    --border-style: solid;
    --border-width: 1px;
    --border-color: var(--ion-color-medium);
    --border-radius: 8px;
    --backdrop-opacity: 0.6;

    --max-height: calc(min(${props => props.maxHeight}, ${MAX_ALLOWED_HEIGHT}) - env(safe-area-inset-top) - env(safe-area-inset-bottom));
    --height: ${props => props.height};

    --max-width: calc(100% - 2 * 16px);
    ${props => props.width 
                ? css`
                    --width: ${props.width};
                `
                : ``
    }

    

    &::part(backdrop){
      background-color: var(--ion-color-medium);
    }
`

interface PopUpDialogComponentProps extends PropsWithChildren {
    renderer: IPopupDialogRenderer;
    maxHeight?: string;
    width?: string;
    /**
     * true if the popup can be closed by clicking on the backdrop overlay
     */
    backdropDismiss?: boolean;
}

export const PopUpDialogComponent: React.FC<PopUpDialogComponentProps> = observer((props) => {


    const captureElementRef = (element: any) => {
        props.renderer.attachElementRef(element)
    }

    const keyDownEventHandler = (event: KeyboardEvent<HTMLIonModalElement>) => {
        if(event.key === "Escape") {
            props.renderer.onEscapeKeyPressed();
        }
    }

    const onDismissHandler = (event: any) => {
        if(event?.detail?.role === 'backdrop') {
            props.renderer.onBackdropDismiss();
        }
    }

    const height = `${props.renderer.totalHeight}px`;
    const maxHeight = props.maxHeight ?? MAX_ALLOWED_HEIGHT;


    return (
        <IonModalBox key={props.renderer.id}
                     id={props.renderer.id}
                     maxHeight={maxHeight}
                     height={height}
                     width={props.width}
                     isOpen={props.renderer.isOpen}
                     keyboardClose={false}
                     showBackdrop={true}
                     backdropDismiss={props.backdropDismiss ?? false}
                     onKeyDown={keyDownEventHandler}
                     ref={captureElementRef}
                     onDidDismiss={onDismissHandler}>
            {props.children}
        </IonModalBox>
    );
});
