import React from "react";
import {
  IonContent,
  IonList,
  IonListHeader,
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


const IonMenuBox = styled(IonMenu)`
  --background: var(--ion-item-background, var(--ion-background-color, #fff));
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 20px;
  --padding-bottom: 20px;
`

const IonListBox = styled(IonList)`
  padding: 0;
`

const IonListHeaderBox = styled(IonListHeader)`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-content: center;
  align-items: center;
  font-size: var(--ion-font-size-h4);
  font-weight: bold;
  min-height: 20px;
  --background: linear-gradient(to right, var(--ion-color-primary), var(--ion-color-tertiary));
  --color: var(--ion-color-primary-contrast);
  padding: 16px;
  width: 100%;
`

const MenuItemsGroupBox = styled(IonList)`
  border-top: 1px solid var(--ion-color-border);
`

const MenuItemGroupComponent: React.FC<{group: ISideMenuItemsGroupViewModel; renderMenuItem: (item: ISideMenuItemViewModel) => React.ReactElement}> = observer((props) => {
  return (
      <MenuItemsGroupBox>
        {props.group.menuItems.map(props.renderMenuItem)}
      </MenuItemsGroupBox>
  )
});


export const LeftSideMenuComponent: React.FC<{appTitle: string}> = observer((props) => {
  const services = useFrameworkServices();
  const menuItems = services.leftSideMenu.rootMenuItems;
  const menuItemsGroups = services.leftSideMenu.menuItemsGroups;

  const renderMenuItem = (item: ISideMenuItemViewModel) => {
    return (
        <React.Fragment key={item.key}>
          {item.render()}
          {item.subItems.map(renderMenuItem)}
        </React.Fragment>
    );
  }


  const renderGroup = (group: ISideMenuItemsGroupViewModel)=> {
    return (
        <MenuItemGroupComponent key={group.key} group={group} renderMenuItem={renderMenuItem}/>
    );
  }

  return (
      <IonMenuBox contentId={MAIN_CONTENT} type="overlay" menuId={LEFT_SIDE_MENU}>
        <IonContent>
          <IonListBox>
            <IonListHeaderBox>
              <span>
                {props.appTitle}
              </span>

            </IonListHeaderBox>

            {menuItems.map(renderMenuItem)}
          </IonListBox>

          {menuItemsGroups.map(renderGroup)}

          {
            /*
            <IonList id="labels-list">
            <IonListHeader>Labels</IonListHeader>
            {labels.map((label, index) => (
                <IonItem lines="none" key={index}>
                  <IonIcon aria-hidden="true" slot="start" icon={bookmarkOutline}/>
                  <IonLabel>{label}</IonLabel>
                </IonItem>
            ))}
          </IonList>
             */
          }
        </IonContent>
      </IonMenuBox>
  );
});

