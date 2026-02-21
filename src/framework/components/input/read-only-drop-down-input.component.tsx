import styled, {css} from "styled-components";
import React from "react";
import {InputBaseBox} from "./input-base.box";

const DropDownInputBaseBox = styled(InputBaseBox)<{$hasSelection: boolean}>`
    display: flex;
    flex-direction: row;
    align-items: center;
    align-content: center;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    cursor: pointer;
    ${props => !props.$hasSelection
    ? css`
                color: var(--ion-color-medium);
        `
    : ''
}
    &:focus-within {
        &::placeholder {
            display: none;
        }
    }
`


export const ReadonlyDropDownInputComponent: React.FC<{value: string, hasSelection: boolean}> = (props) => {
    return (
        <DropDownInputBaseBox type={"text"}
                              readOnly={true}
                              value={props.value}
                              $hasSelection={props.hasSelection}/>
    )
}