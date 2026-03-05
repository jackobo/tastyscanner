import {observer} from "mobx-react";
import React from "react";
import {useServices} from "../../hooks/use-services.hook";
import styled from "styled-components";

const LogoContainerBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: white;
`

export const AppLogo: React.FC = observer(() => {
    const services = useServices();


    return (
        <LogoContainerBox>
            <img src={services.theme.currentTheme.assets.icons.logo_svg.toString()} alt={'logo'} width={50} height={50}/>
        </LogoContainerBox>

    )

})