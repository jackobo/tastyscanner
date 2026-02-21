import React, {PropsWithChildren, useEffect, useRef} from "react";
import {observer} from "mobx-react";
import {IDialogHandler} from "../../../services/dialog/dialog.service.interface";
import styled, {css} from "styled-components";
import {IonHeader} from "@ionic/react";
import {DialogCloseButtonComponent, DialogCloseButtonVisibility} from "../close-button/dialog-close-button.component";
import {DialogCloseButtonBehavior} from "../../../services/dialog/dialog-enums";
import {StandardDialogTitleComponent} from "./standard-dialog-title.component";
import {useElementScrollHeight} from "../../../hooks/use-element-scroll-height";

const DialogHeaderContainerBox = styled(IonHeader)<{$showBottomBorder: boolean; $hidePaddingBottom: boolean; $extraTopPadding: string}>`
    display: flex;
    flex-direction: column;
    gap: 0;
    box-shadow: none;
    padding: 16px;
    background-color: var(--ion-color-light);
    color: var(--ion-color-contrast);
    ${props => props.$showBottomBorder 
        ? css`
                border-bottom: 1px solid  var(--ion-color-border);
        `
        : ''
    }

    ${props => props.$hidePaddingBottom
            ? css`
                padding-bottom: 0;
        `
            : ''
    }
}
`

const TopSectionBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    border-style: none;
    width: 100%;
`


const TopLeftSectionBox = styled.div`
    flex-grow: 1;
`

const BottomSectionBox = styled.div`
    width: 100%;
`

interface StandardDialogHeaderComponentProps extends PropsWithChildren {
    title?: (string | React.ReactElement | null);
    renderTitleOnTheFirstRow?: boolean;
    dialogHandler: IDialogHandler;
    closeButtonVisibility?: DialogCloseButtonVisibility;
    className?: string;
    showBottomBorder?: 'never' | 'always' | 'onScroll';
}
export const StandardDialogHeaderComponent: React.FC<StandardDialogHeaderComponentProps> = observer((props) => {

    const headerElementRef = useRef<HTMLIonHeaderElement | null>(null);
    const scrollHeight = useElementScrollHeight(headerElementRef);

    useEffect(() => {
        props.dialogHandler.headerHeight = scrollHeight;
    }, [props.dialogHandler, scrollHeight]);

    let closeButtonVisibility = props.closeButtonVisibility;
    if(!closeButtonVisibility) {
        if(props.dialogHandler.closeButtonBehavior === DialogCloseButtonBehavior.None) {
            closeButtonVisibility = 'hidden';
        } else {
            closeButtonVisibility = 'visible';
        }
    }




    const renderTitle = () => {
        if(props.renderTitleOnTheFirstRow) {
            return null;
        }

        if(!props.title) {
            return null;
        }


        return (
            <StandardDialogTitleComponent>
                {props.title}
            </StandardDialogTitleComponent>
        )
    }


    let showBottomBorder: boolean;
    switch (props.showBottomBorder ?? "always") {
        case 'onScroll':
            showBottomBorder = props.dialogHandler.hasScroll;
            break;
        case 'always':
            showBottomBorder = true;
            break
        default:
            showBottomBorder = false;
            break;

    }


    const hasChildren = React.Children.count(props.children) > 0;

    return (
        <DialogHeaderContainerBox ref={headerElementRef}
                                  $showBottomBorder={showBottomBorder}
                                  $hidePaddingBottom={hasChildren}
                                  $extraTopPadding={"0px"}
                                  className={props.className} >
            <TopSectionBox>
                <TopLeftSectionBox>
                    {props.renderTitleOnTheFirstRow && (<TopLeftSectionBox>{props.title}</TopLeftSectionBox>)}
                </TopLeftSectionBox>
                <DialogCloseButtonComponent dialogHandler={props.dialogHandler}
                                            visibility={closeButtonVisibility}/>
            </TopSectionBox>
            {renderTitle()}
            <BottomSectionBox>
                {props.children}
            </BottomSectionBox>
        </DialogHeaderContainerBox>
    );
});
