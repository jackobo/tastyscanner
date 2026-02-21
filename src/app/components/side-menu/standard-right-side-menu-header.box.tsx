import styled from "styled-components";
import React, {PropsWithChildren} from "react";
import {observer} from "mobx-react";

const ContainerBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
`


const ContentBox = styled.div`
    padding: var(--ion-space-16) var(--ion-space-8);
    font-size: var(--ion-font-size-h6);
    font-weight: var(--ion-font-weight-bold);
`

interface StandardRightSideMenuHeaderComponentProps extends PropsWithChildren {
    renderIcon?: () => React.ReactElement | null;
}

export const StandardRightSideMenuHeaderComponent: React.FC<StandardRightSideMenuHeaderComponentProps> = observer((props) => {

    const renderIcon = () => {
        if(!props.renderIcon) {
            return null;
        }

        return props.renderIcon();
    }

    return (
        <ContainerBox>
            {renderIcon()}
            <ContentBox>
                {props.children}
            </ContentBox>
        </ContainerBox>
    )
})