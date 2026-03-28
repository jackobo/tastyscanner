import React from "react";
import {observer} from "mobx-react";
import {IonContent, IonHeader, IonIcon, IonMenu, IonToolbar} from "@ionic/react";
import styled from "styled-components";
import {closeOutline} from "ionicons/icons";
import {useFrameworkServices} from "../../../hooks/use-framework-services.hook";
import {ISideMenuContentRenderer} from "../../../services/side-menu/side-menu-content-renderer.interface";

const IonMenuBox = styled(IonMenu)`
    --width: 30vw;
    ${props => props.theme.screenMediaQuery.mAndBelow} {
        --width: 50vw;
    }
    
    ${props => props.theme.screenMediaQuery.sAndBelow} {
        --width: 80vw;
    }
    
    ${props => props.theme.screenMediaQuery.xsAndBelow} {
        --width: 100vw;
    }
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

export const RightSideMenuComponent: React.FC<{getCurrentRenderer: () => ISideMenuContentRenderer | null; menuId: string}> = observer((props) => {
    const services = useFrameworkServices();

    const renderer = props.getCurrentRenderer();
    if(!renderer) {
        return null;
    }

    const renderHeader = () => {
        return renderer.renderHeader();
    }

    const renderContent = () => {

        return renderer.renderContent();
    }

    const onCloseButtonClick = async () => {
        await services.rightSideMenu.close(renderer);
    }

    const onDismissed = async () => {
        if(!renderer.isSticky) {
            await services.rightSideMenu.close(renderer);
        }
    }


    return (
        <IonMenuBox menuId={props.menuId}
                    contentId={services.rightSideMenu.contentId}
                    side="end"
                    type="overlay" onIonDidClose={onDismissed}>
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
