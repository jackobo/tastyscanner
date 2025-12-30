import {
  IonChip,
  IonContent,
  IonItem,
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
import {IronCondorSettingsComponent} from "./iron-condor-settings.component";

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

const TickerMenuItemComponent: React.FC<{ticker: ITickerViewModel}> = observer((props) => {
  const services = useServices();
  const onClick = () => {
    services.optionsChains.currentTicker = props.ticker;
  }

  const renderIronCondorsCount = () => {
    let count = 0;
    props.ticker.getExpirationsWithIronCondors().forEach(exp => {
      count += exp.ironCondors.length;
    })

    if(count === 0) {
      return null;
    }

    return (
        <IonChip>
          {count}
        </IonChip>
    )
  }

  return  <IonMenuToggle autoHide={false} onClick={onClick}>
    <MenuItemBox className={props.ticker.symbol === services.optionsChains.currentTicker.symbol ? 'selected' : ''} lines="none" detail={false}>
      <MenuItemContentBox>
        <TickerSymbolBox>{props.ticker.symbol}</TickerSymbolBox>
        {renderIronCondorsCount()}
      </MenuItemContentBox>
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

          <IronCondorSettingsComponent/>
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
