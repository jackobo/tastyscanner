import React, {KeyboardEvent, PropsWithChildren} from "react";
import {IStandardDialogRenderer} from "../../services/dialog/dialog.service.interface";
import {observer} from "mobx-react";
import {IonModal} from "@ionic/react";
import styled, {css} from "styled-components";

const MAX_ALLOWED_HEIGHT_FOR_LARGE_SCREEN = '95%';

interface IonModalBoxProps {
    height: string;
    maxHeight: string;
    width?: string;
    maxWidth?: string;
}


const IonModalWrapper = styled(IonModal)<IonModalBoxProps>`
    --backdrop-opacity: 0.7;
    
    --height: ${props => props.height};
    --min-height: 60%;
    --max-height: ${props => props.maxHeight};
    --max-width: 100%;
    ${
    props => props.width 
            ? css`
              --width: ${props.width};
            `
            : ''
    }

    --border-style: solid;
    --border-width: 1px;
    --border-color: var(--ion-color-medium);
    --border-radius: 8px;
    
    &::part(backdrop) {
        background-color: var(--ion-color-medium);;
    }


`


interface StandardModalDialogComponentProps extends PropsWithChildren {
    renderer: IStandardDialogRenderer;
    width?: string;
    maxHeight?: string;
}

export const StandardDialogComponent: React.FC<StandardModalDialogComponentProps> = observer((props) => {
    const captureElementRef = (element: any) => {
        props.renderer.attachElementRef(element)
    }

    let width = props.width;
    let height = `${props.renderer.totalHeight}px`;
    let maxHeight = props.maxHeight ?? MAX_ALLOWED_HEIGHT_FOR_LARGE_SCREEN;

    if(props.renderer.forceFullScreenOnLargeScreens) {
        height = "100%";
        width = "100%";
        maxHeight = '100%';
    }

    const keyDownEventHandler = (event: KeyboardEvent<HTMLIonModalElement>) => {
        if(event.key === "Escape") {
            props.renderer.onEscapeKeyPressed();
        }
    }

    return (
        <IonModalWrapper key={props.renderer.id}
                         width={width}
                         height={height}
                         maxHeight={maxHeight}
                         id={props.renderer.id}
                         ref={captureElementRef}
                         isOpen={props.renderer.isOpen}
                         keyboardClose={false}
                         backdropDismiss={false}
                         showBackdrop={false}
                         onDidPresent={() => props.renderer.onDidPresent()}
                         onKeyDown={keyDownEventHandler}>
            {props.children}
        </IonModalWrapper>
    )
});
