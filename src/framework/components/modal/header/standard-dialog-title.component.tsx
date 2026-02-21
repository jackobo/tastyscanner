import React, {PropsWithChildren} from "react";
import styled from "styled-components";
import {observer} from "mobx-react";

const StandardDialogTitleBox = styled.div`
    font-size: var(--ion-font-size-h4);
    font-weight: bold;
`

interface StandardDialogTitleComponentProps extends PropsWithChildren {
    className?: string;
}
export const StandardDialogTitleComponent: React.FC<StandardDialogTitleComponentProps> = observer((props) => {
    return (
        <StandardDialogTitleBox className={props.className}>
            {props.children}
        </StandardDialogTitleBox>
    )
})