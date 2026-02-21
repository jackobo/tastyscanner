import React from "react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {SpinnerComponent} from "./spinner.component";

const SpinnerContainerBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
`

export const PageSpinnerComponent: React.FC = observer(() => {
    return (
        <SpinnerContainerBox>
            <SpinnerComponent/>
        </SpinnerContainerBox>
    )
})