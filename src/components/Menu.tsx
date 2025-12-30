import {
  IonAccordion,
  IonAccordionGroup,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle
  //IonNote,
} from '@ionic/react';

import './Menu.css';
import {observer} from "mobx-react-lite";
import {useServices} from "../hooks/use-services.hook";
import {ITickerViewModel} from "../models/ticker.view-model.interface";
import styled from "styled-components";
import {IronCondorFiltersComponent} from "./iron-condor-filters.component";

const MenuItemBox = styled(IonItem)`
  cursor: pointer;
`

const TickerSymbolBox = styled.span`
  font-weight: bold;
  flex-grow: 1;
`

const MenuItemContentBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const TickersBox = styled.div`
  padding: 16px 0;
`

const TickerMenuItemComponent: React.FC<{ticker: ITickerViewModel}> = observer((props) => {
  const services = useServices();
  const onClick = () => {
    services.optionsChains.currentTicker = props.ticker;
  }



  return  <IonMenuToggle autoHide={false} onClick={onClick}>
    <MenuItemBox className={props.ticker.symbol === services.optionsChains.currentTicker?.symbol ? 'selected' : ''} lines="none" detail={false}>
      <MenuItemContentBox>
        <TickerSymbolBox>{props.ticker.symbol}</TickerSymbolBox>
      </MenuItemContentBox>
    </MenuItemBox>
  </IonMenuToggle>
})

const FiltersAccordionHeaderBox = styled(IonItem)`
  cursor: pointer;
`



const Menu: React.FC = observer(() => {
  const services = useServices();

  const tickers = services.optionsChains.tickers;

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>IC Scanner</IonListHeader>
          <IonAccordionGroup>
            <IonAccordion>
              <FiltersAccordionHeaderBox slot="header" color="light">
                <IonLabel>Filters</IonLabel>
              </FiltersAccordionHeaderBox>
              <div slot="content">
                <IronCondorFiltersComponent/>
              </div>
            </IonAccordion>
          </IonAccordionGroup>

        </IonList>

        <IonAccordionGroup>
          <IonAccordion>
            <FiltersAccordionHeaderBox slot="header" color="light">
              <IonLabel>Tickers</IonLabel>
            </FiltersAccordionHeaderBox>
            <TickersBox slot="content">
              {tickers.map((ticker) => {
                return (
                    <TickerMenuItemComponent key={ticker.symbol} ticker={ticker} />
                );
              })}
            </TickersBox>
          </IonAccordion>
        </IonAccordionGroup>

      </IonContent>
    </IonMenu>
  );
});

export default Menu;
