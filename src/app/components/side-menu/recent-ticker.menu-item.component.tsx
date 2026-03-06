import React from "react";
import {observer} from "mobx-react";
import {
    IRecentTickerMenuItemViewModel
} from "../../services/side-menu/models/recent-tickers/recent-ticker-menu-item.view-model.interface";
import styled from "styled-components";
import {RemoveButtonComponent} from "../../../framework/components/specialized-buttons/remove-button.component";
import {useServices} from "../../hooks/use-services.hook";
import {radioButtonOffOutline, radioButtonOnOutline} from "ionicons/icons";
import {IonIcon} from "@ionic/react";


const ContainerBox = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
`

const SymbolBox = styled.span`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100%;
    width: 100%;
`

const RemoveButtonBox = styled.div`
    position: absolute;
    right: 0;
`

const IconBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-right: var(--ion-space-12);
    height: 100%;
`

interface RecentTickerMenuItemComponentProps {
    menuItem: IRecentTickerMenuItemViewModel;
}
export const RecentTickerMenuItemComponent: React.FC<RecentTickerMenuItemComponentProps> = observer((props) => {
    const services = useServices();


    const onSelectTicker = async () => {
        await services.tickers.setCurrentTicker(props.menuItem.ticker.symbol);
    }

    const onRemoveTicker = () => {
        services.tickers.removeFromRecentTickers(props.menuItem.ticker.symbol);
    }
    const renderRemoveButton = () => {
        if(!props.menuItem.isHovered) {
            return null;
        }

        if(props.menuItem.ticker.symbol === services.tickers.currentTicker?.symbol) {
            return null;
        }

        return (
            <RemoveButtonBox>
                <RemoveButtonComponent onClick={onRemoveTicker}
                                       tooltipText={services.language.translate('Remove from recent tickers')}/>
            </RemoveButtonBox>

        )
    }
    return (
        <ContainerBox onMouseEnter={() => props.menuItem.isHovered = true}
                      onMouseLeave={() => props.menuItem.isHovered = false}
                      >
            <IconBox onClick={onSelectTicker}>
                <IonIcon slot="start" icon={props.menuItem.isCurrentTicker ? radioButtonOnOutline : radioButtonOffOutline}/>
            </IconBox>

            <SymbolBox onClick={onSelectTicker}>
                {props.menuItem.ticker.symbol}
            </SymbolBox>
            {renderRemoveButton()}
        </ContainerBox>

    )
})