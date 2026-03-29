import React from "react";
import {
    IonContent,
    IonHeader,
    IonList,
    IonMenu,
} from '@ionic/react';


import {observer} from "mobx-react";
import {MAIN_CONTENT} from "../../../global-constants";
import styled from "styled-components";
import {LEFT_SIDE_MENU} from "../side-menu-consts";
import {useFrameworkServices} from "../../../hooks/use-framework-services.hook";
import {ISideMenuItemViewModel} from "../../../services/side-menu/left/models/side-menu-item.view-model.interface";
import {
  ISideMenuItemsGroupViewModel
} from "../../../services/side-menu/left/models/side-menu-items-group.view-model.interface";
import {StandardSideMenuItemComponent} from "./standard-side-menu-item.component";


const IonMenuBox = styled(IonMenu)`
  --background: var(--ion-item-background, var(--ion-background-color, #fff));
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 20px;
  --padding-bottom: 20px;
  --side-max-width: 300px;
`

const HeaderBox = styled(IonHeader)`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--ion-space-12);
    font-size: var(--ion-font-size-h4);
    font-weight: bold;
    min-height: 20px;
    background: linear-gradient(to right, var(--ion-color-primary), var(--ion-color-tertiary));
    color: var(--ion-color-primary-contrast);
    padding: var(--ion-space-8);
    width: 100%;
`

const ContentBox = styled(IonContent)`
  --padding-top: var(--ion-space-8);
`

const MainMenusListBox = styled(IonList)`
  padding:  0;
`

const MenuItemsGroupBox = styled(IonList)`
  border-top: 1px solid var(--ion-color-border);
`

const MenuItemGroupComponent: React.FC<{group: ISideMenuItemsGroupViewModel; renderMenuItem: (item: ISideMenuItemViewModel) => React.ReactElement}> = observer((props) => {
  return (
      <MenuItemsGroupBox>
        {props.group.menuItems.filter(item => item.isVisible).map(props.renderMenuItem)}
      </MenuItemsGroupBox>
  )
});


export const LeftSideMenuComponent: React.FC<{appTitle: string; renderLogo?: () => React.ReactElement}> = observer((props) => {
    const services = useFrameworkServices();
    const menuItems = services.leftSideMenu.rootMenuItems.filter(item => item.isVisible);
    const menuItemsGroups = services.leftSideMenu.menuItemsGroups.filter(g => g.menuItems.some(item => item.isVisible));

    const renderMenuItem = (item: ISideMenuItemViewModel, level: number) => {

        const subItems = item.subItems.filter(item => item.isVisible);

        if(subItems.length === 0) {
            return (
                <StandardSideMenuItemComponent key={item.key} menuItem={item} level={level}/>
            );
        } else {
            return (
                <React.Fragment key={item.key}>
                    <StandardSideMenuItemComponent menuItem={item} level={level}/>
                    {subItems.map(subItem => renderMenuItem(subItem, level + 1))}
                </React.Fragment>
            );
        }


    }


    const renderGroup = (group: ISideMenuItemsGroupViewModel) => {
        return (
            <MenuItemGroupComponent key={group.key} group={group} renderMenuItem={(item) => renderMenuItem(item, 0)}/>
        );
    }

    const renderLogo = () => {
        if (props.renderLogo) {
            return (
                <div>
                    {props.renderLogo()}
                </div>
            );
        }

        return null;
    }

    return (
        <IonMenuBox contentId={MAIN_CONTENT} type="overlay" menuId={LEFT_SIDE_MENU}>
            <HeaderBox>
                <div>
                    {renderLogo()}
                </div>
                <div>
                    {props.appTitle}
                </div>
            </HeaderBox>

            <ContentBox>
                <MainMenusListBox>
                    {menuItems.map(item => renderMenuItem(item, 0))}
                </MainMenusListBox>

                {menuItemsGroups.map(renderGroup)}

            </ContentBox>
        </IonMenuBox>
    );
});

