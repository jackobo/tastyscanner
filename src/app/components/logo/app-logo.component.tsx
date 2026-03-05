import {observer} from "mobx-react";
import React from "react";
import styled from "styled-components";

const LogoContainerBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: var(--ion-color-primary-contrast);
    background-image: url(${props => props.theme.assets.icons.logo_svg.toString()});
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center center;
    width: 50px;
    height: 50px;
`

export const AppLogo: React.FC = observer(() => {

    return (
        <LogoContainerBox>

        </LogoContainerBox>

    )

})