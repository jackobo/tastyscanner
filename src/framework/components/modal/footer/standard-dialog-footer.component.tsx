import React, {PropsWithChildren, useEffect, useRef} from "react";
import {observer} from "mobx-react";
import {IDialogHandler} from "../../../services/dialog/dialog.service.interface";
import styled, {css} from "styled-components";
import {IonFooter} from "@ionic/react";

import {useElementScrollHeight} from "../../../hooks/use-element-scroll-height";

function computePaddings(shouldPreserveBottomSafeArea: boolean, hasChildren: boolean) {
    if(shouldPreserveBottomSafeArea) {
        if(hasChildren) {
            return css`
              padding: 16px 16px calc(16px + env(safe-area-inset-bottom)) 16px;
            `
        } else {
            return css`
              padding: 0 0 env(safe-area-inset-bottom) 0;
            `
        }

    }

    if(hasChildren) {
        return css`
              padding: 16px;
        `
    }

    return (
        css`
            padding: 0;
        `
    )
}

const FooterBox = styled(IonFooter)<{shouldPreserveBottomSafeArea: boolean; horizontallyCentered?: boolean; hasChildren: boolean}>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 16px;
    width: 100%;
    box-shadow: none;
    background-color: var(--ion-color-light);
    color: var(--ion-color-light-contrast);
    
    ${props => computePaddings(props.shouldPreserveBottomSafeArea, props.hasChildren)}
    ${
            props => props.horizontallyCentered
                    ? css`
                  align-items: center;
                `
                    : ''
    }
    
   
`

interface StandardDialogFooterComponentProps extends PropsWithChildren {
    className?: string;
    dialogHandler: IDialogHandler;
    horizontallyCentered?: boolean;
}


export const StandardDialogFooterComponent: React.FC<StandardDialogFooterComponentProps> = observer((props) => {
    const footerRef = useRef<HTMLIonFooterElement | null>(null);
    const hasChildren = React.Children.count(props.children) > 0;
    const scrollHeight = useElementScrollHeight(footerRef);

    useEffect(() => {
        props.dialogHandler.footerHeight = scrollHeight;
    }, [props.dialogHandler, scrollHeight]);

    return (
        <FooterBox ref={footerRef}
                   className={props.className}
                   hasChildren={hasChildren}
                   horizontallyCentered={props.horizontallyCentered}
                   shouldPreserveBottomSafeArea={props.dialogHandler.shouldPreserveBottomSafeArea}>
            {props.children}
        </FooterBox>
    );


});
