import React from "react";
import {
  IonAccordion,
  IonAccordionGroup,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,

  //IonNote,
} from '@ionic/react';

import './Menu.css';
import {observer} from "mobx-react-lite";
import {useServices} from "../hooks/use-services.hook";
import styled from "styled-components";
import {IronCondorFiltersComponent} from "./iron-condor-filters.component";
import {WatchListsComponent} from "./watch-lists.component";
import {TickerMenuItemComponent} from "./ticker-menu-item.component";



const TickersBox = styled.div`
  padding: 16px 0;
`

const FiltersBox = styled.div`
  
`

const MenuTitleBox = styled.div`
  padding: 8px 0;
`


const FiltersAccordionHeaderBox = styled(IonItem)`
  cursor: pointer;
`



const Menu: React.FC = observer(() => {
  const services = useServices();

  const tickers = services.tickers.recentTickers;



  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>
            <MenuTitleBox>
              IC Scanner
            </MenuTitleBox>

          </IonListHeader>
          <IonAccordionGroup>
            <IonAccordion>
              <FiltersAccordionHeaderBox slot="header" color="light">
                <IonLabel>Filters</IonLabel>
              </FiltersAccordionHeaderBox>
              <FiltersBox slot="content">
                <IronCondorFiltersComponent/>
              </FiltersBox>
            </IonAccordion>
          </IonAccordionGroup>

        </IonList>

        <IonAccordionGroup value="recentTickers">
          <IonAccordion value="recentTickers">
            <FiltersAccordionHeaderBox slot="header" color="light">
              <IonLabel>Recent Tickers</IonLabel>
            </FiltersAccordionHeaderBox>

            <TickersBox slot="content">
              {tickers.map((ticker) => {
                return (
                    <TickerMenuItemComponent key={ticker.symbol} tickerSymbol={ticker.symbol} />
                );
              })}
            </TickersBox>
          </IonAccordion>
        </IonAccordionGroup>

        <WatchListsComponent/>

      </IonContent>
    </IonMenu>
  );
});

export default Menu;
