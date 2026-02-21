import React from "react";
import {observer} from "mobx-react";
import styled from "styled-components";


const MessageContainerBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    min-height: 150px;
    font-size: var(--ion-font-size-body1);
    padding: var(--ion-space-20);
    color: var(--ion-color-notes-tint);
`


const TextBox = styled.div`
    margin-bottom: var(--ion-space-16);
    white-space: nowrap;
`

interface EmptyDropDownMessageComponentProps {
    message: string | React.ReactElement;
    className?: string;
}

export const EmptyDropDownMessageComponent: React.FC<EmptyDropDownMessageComponentProps> = observer((props) => {

    return (
        <MessageContainerBox className={props.className}>
            <TextBox>
                {props.message}
            </TextBox>
        </MessageContainerBox>
    )
});
