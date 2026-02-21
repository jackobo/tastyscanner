import React from "react";
import {observer} from "mobx-react";
import {IonContent, IonHeader, IonIcon, IonMenu, IonToolbar} from "@ionic/react";
import styled from "styled-components";
import {closeOutline} from "ionicons/icons";
import {useFrameworkServices} from "../../../hooks/use-framework-services.hook";

const IonMenuBox = styled(IonMenu)`
    --width: 25vw;
`

const IonContentBox = styled(IonContent)`
    
`

const ToolBarContentBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--ion-space-16);
    width: 100%;
    padding: 0 var(--ion-space-12);
`

const HeaderLeftSectionBox = styled.div`
    flex-grow: 1;
    font-size: var(--ion-font-size-h6);
    font-weight: var(--ion-font-weight-bold);
`

const CloseButtonBox = styled.div`
    cursor: pointer;
    font-size: 28px;
`

export const RightSideMenuComponent: React.FC = observer(() => {
    const services = useFrameworkServices();

    const renderer = services.rightSideMenu.currentRenderer;
    if(!renderer) {
        return null;
    }

    const renderHeader = () => {
        return renderer.renderHeader();
    }

    const renderContent = () => {
        if(!services.rightSideMenu.currentRenderer) {
            return null;
        }

        return renderer.renderContent();
    }

    const onCloseButtonClick = async () => {
        await services.rightSideMenu.close();
    }

    return (
        <IonMenuBox menuId={services.rightSideMenu.sideMenuId} contentId={services.rightSideMenu.contentId} side="end" type="overlay">
            <IonHeader>
                <IonToolbar>
                    <ToolBarContentBox>
                        <HeaderLeftSectionBox>
                            {renderHeader()}
                        </HeaderLeftSectionBox>
                        <CloseButtonBox onClick={onCloseButtonClick}>
                            <IonIcon icon={closeOutline}/>
                        </CloseButtonBox>
                    </ToolBarContentBox>

                </IonToolbar>
            </IonHeader>
            <IonContentBox>
                {renderContent()}
            </IonContentBox>
        </IonMenuBox>
    )
})
