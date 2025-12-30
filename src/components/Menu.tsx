import {
  IonContent,
  IonItem,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import './Menu.css';
import {observer} from "mobx-react-lite";
import {useServices} from "../hooks/use-services.hook";
import {ITickerViewModel} from "../models/ticker.view-model.interface";
import styled from "styled-components";
const MenuItemBox = styled(IonItem)`
  cursor: pointer;
`

const TickerMenuItemComponent: React.FC<{ticker: ITickerViewModel}> = observer((props) => {
  const services = useServices();
  const onClick = () => {
    services.optionsChains.currentTicker = props.ticker;
  }
  return  <IonMenuToggle autoHide={false} onClick={onClick}>
    <MenuItemBox className={props.ticker.symbol === services.optionsChains.currentTicker.symbol ? 'selected' : ''} lines="none" detail={false}>
      {props.ticker.symbol}
    </MenuItemBox>
  </IonMenuToggle>
})



const Menu: React.FC = observer(() => {
  const services = useServices();

  const tickers = services.optionsChains.tickers;

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Tasty IC Scanner</IonListHeader>
          <IonNote></IonNote>
          <div>Settings here</div>
        </IonList>

        <IonList id="labels-list">
          <IonListHeader>Tickers</IonListHeader>
          {tickers.map((ticker) => {
            return (
                <TickerMenuItemComponent key={ticker.symbol} ticker={ticker} />
            );
          })}
        </IonList>

      </IonContent>
    </IonMenu>
  );
});

export default Menu;
