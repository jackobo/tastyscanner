import { observer } from "mobx-react";
import React from "react";
import {useServices} from "../hooks/use-services.hook";
import {IonItem, IonMenuToggle} from "@ionic/react";
import styled from "styled-components";

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

export const TickerMenuItemComponent: React.FC<{tickerSymbol: string}> = observer((props) => {
    const services = useServices();
    const onClick = async () => {
        await services.tickers.setCurrentTicker(props.tickerSymbol);
    }



    return  <IonMenuToggle autoHide={false} onClick={onClick}>
        <MenuItemBox className={props.tickerSymbol === services.tickers.currentTicker?.symbol ? 'selected' : ''} lines="none" detail={false}>
            <MenuItemContentBox>
                <TickerSymbolBox>{props.tickerSymbol}</TickerSymbolBox>
            </MenuItemContentBox>
        </MenuItemBox>
    </IonMenuToggle>
})