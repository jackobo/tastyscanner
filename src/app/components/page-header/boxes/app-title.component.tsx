import styled from "styled-components";
import React from "react";

export const AppTitleBox = styled.span`
    font-weight: bold;
    font-size: var(--ion-font-size-h4);
`

export const AppTitleComponent: React.FC = () => {
    return (
        <AppTitleBox>
            Tasty Goby
        </AppTitleBox>

    )
}

