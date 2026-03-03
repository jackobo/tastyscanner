import React from "react";
import {observer} from "mobx-react";
import {
    IRecentTickerMenuItemViewModel
} from "../../services/side-menu/models/recent-tickers/recent-ticker-menu-item.view-model.interface";
import styled from "styled-components";
import {RemoveButtonComponent} from "../../../framework/components/specialized-buttons/remove-button.component";
import {useServices} from "../../hooks/use-services.hook";


const ContainerBox = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
`

const SymbolBox = styled.span`
    width: 100%;
`

const RemoveButtonBox = styled.div`
    position: absolute;
    right: 0;
`

interface RecentTickerMenuItemComponentProps {
    menuItem: IRecentTickerMenuItemViewModel;
}
export const RecentTickerMenuItemComponent: React.FC<RecentTickerMenuItemComponentProps> = observer((props) => {
    const services = useServices();
    const [isMouseInside, setIsMouseInside] = React.useState(false);

    const onSelectTicker = async () => {
        await services.tickers.setCurrentTicker(props.menuItem.ticker.symbol);
    }

    const onRemoveTicker = () => {
        services.tickers.removeFromRecentTickers(props.menuItem.ticker.symbol);
    }
    const renderRemoveButton = () => {
        if(!isMouseInside) {
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
        <ContainerBox onMouseEnter={() => setIsMouseInside(true)}
                      onMouseLeave={() => setIsMouseInside(false)}>
            <SymbolBox onClick={onSelectTicker}>
                {props.menuItem.ticker.symbol}
            </SymbolBox>
            {renderRemoveButton()}
        </ContainerBox>

    )
})