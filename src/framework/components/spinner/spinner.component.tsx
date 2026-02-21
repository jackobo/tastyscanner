import React from "react";
import {observer} from "mobx-react";
import styled, {keyframes} from "styled-components";


const rotateAnimation = keyframes`
    0%   {transform: rotate(0deg)}
    100%   {transform: rotate(360deg)}
`

const prixClipFix = keyframes`
    0%   {clip-path:polygon(50% 50%,0 0,0 0,0 0,0 0,0 0)}
    50%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 0,100% 0,100% 0)}
    75%, 100%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,100% 100%,100% 100%)}
`

const SpinnerContainerBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: fit-content;
    height: fit-content;
    font-size: 0.75rem;
    font-weight: bold;
    border-radius: 50%;
    box-shadow: 0 8px 60px #0D0A2C0D, 0 -8px 60px #0D0A2C0D, 8px 0 60px #0D0A2C0D, -8px 0 60px #0D0A2C0D;
`

const SpinnerBox = styled.span`
    width: 120px;
    height: 120px;
    border-radius: 50%;
    position: relative;
    animation: ${rotateAnimation} 1s linear infinite;
    &:before, &:after {
        content: "";
        box-sizing: border-box;
        position: absolute;
        inset: 0;
        border-radius: 50%;
        border: 5px solid var(--ion-color-primary);
        animation: ${prixClipFix} 2s linear infinite ;
    }
    &:after {
        inset: 8px;
        transform: rotate3d(90, 90, 0, 180deg );
        border-color: var(--ion-color-danger);
    }
`

interface SpinnerComponentProps {
    className?: string;
}
export const SpinnerComponent: React.FC<SpinnerComponentProps> = observer((props) => {

    return (
        <SpinnerContainerBox className={props.className}>
            <SpinnerBox/>
        </SpinnerContainerBox>
    );
});
