import React, {PropsWithChildren, useEffect, useRef} from "react";
import {observer} from "mobx-react";
import styled, {css} from "styled-components";
import {IonContent, ScrollDetail} from "@ionic/react";
import {IDialogHandler} from "../../../services/dialog/dialog.service.interface";
import {useElementScrollHeight} from "../../../hooks/use-element-scroll-height";
import {CSS_CLASS_STANDARD_DIALOG_CONTENT_WRAPPER} from "./dialog-content-css-classes";



const DialogContentBox = styled(IonContent)`
    --background: var(--ion-color-dark-contrast);
    --color: var(--ion-color-dark);
    --padding-top: 16px;
    --padding-bottom: 16px;
    --padding-start: 16px;
    --padding-end: 16px;
    --width: 100%;
    position: relative; /* this is for drop down popper that uses strategy: absolute*/
`

const ContentWrapperBox = styled.div<{$fullHeight: boolean}>`
    width: 100%;
    display: flex;
    flex-direction: column;
    
    ${
        props => props.$fullHeight
            ? css`
                    min-height: 100%;
            `
            : css`
                    min-height: 350px;
            `
    }
`

interface StandardDialogContentComponentProps extends PropsWithChildren {
    className?: string;
    onScroll?: (event: CustomEvent<ScrollDetail>) => void;
    dialogHandler: IDialogHandler;
    fullContentHeight?: boolean;
    ignoreVerticalPaddingsWhenComputeHeight?: boolean;
}
export const StandardDialogContentComponent: React.FC<StandardDialogContentComponentProps> = observer((props) => {
    const contentWrapperRef = useRef<HTMLDivElement | null>(null);
    const scrollHeight = useElementScrollHeight(contentWrapperRef);

    useEffect(() => {
        const verticalPaddings = (2 * 20) + 10; //extra 10px to avoid scrollbar to appear because of few pixels difference.
        if(props.ignoreVerticalPaddingsWhenComputeHeight) {
            props.dialogHandler.contentHeight = scrollHeight;
        } else {
            props.dialogHandler.contentHeight = scrollHeight + verticalPaddings;
        }

    }, [props.dialogHandler, scrollHeight, props.ignoreVerticalPaddingsWhenComputeHeight]);

    const onScrollHandler = (event: CustomEvent<ScrollDetail>) => {
        props.dialogHandler.hasScroll = event.detail.scrollTop > 4;

        if(props.onScroll) {
            props.onScroll(event);
        }
    }

    return (
        <DialogContentBox className={props.className} onIonScroll={onScrollHandler} scrollEvents={true}>
            <ContentWrapperBox ref={contentWrapperRef}
                               $fullHeight={Boolean(props.fullContentHeight)}
                               className={CSS_CLASS_STANDARD_DIALOG_CONTENT_WRAPPER}>
                {props.children}
            </ContentWrapperBox>

        </DialogContentBox>
    )
});
