import React, {useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import {useServices} from "../hooks/use-services.hook";
import {IonAccordion, IonAccordionGroup } from "@ionic/react";
import { IonItem, IonLabel } from "@ionic/react";
import styled from "styled-components";
import {IWatchListRawData} from "../services/market-data-privider/market-data-provider.service.interface";
import {TickerMenuItemComponent} from "./ticker-menu-item.component";

const AccordionHeaderBox = styled(IonItem)`
  cursor: pointer;
`

const TickersBox = styled.div`
  padding: 16px 0;
`

const WatchListComponent: React.FC<{watchList: IWatchListRawData}> = observer((props) => {
    return (
        <IonAccordion value={props.watchList.name}>
            <AccordionHeaderBox slot="header" color="light">
                <IonLabel>{props.watchList.name}</IonLabel>
            </AccordionHeaderBox>

            <TickersBox slot="content">
                {props.watchList.entries.map((ticker) => {
                    return (
                        <TickerMenuItemComponent key={ticker} tickerSymbol={ticker}/>
                    );
                })}
            </TickersBox>
        </IonAccordion>
    )
});


export const WatchListsComponent: React.FC = observer(() => {
    const [watchLists, setWatchLists] = useState<IWatchListRawData[]>();
    const services = useServices();

    useEffect(() => {
        services.marketDataProvider.getUserWatchLists().then(data => {
            setWatchLists(data);
        });
    }, [services.marketDataProvider]);

    return (
        <IonAccordionGroup>
            {watchLists?.map((watchList) => (<WatchListComponent key={watchList.name} watchList={watchList}/>) )}
        </IonAccordionGroup>
    )
})