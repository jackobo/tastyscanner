import React from "react";
import {observer} from "mobx-react";
import {
    IRecentTickersMenuItemViewModel
} from "../../services/side-menu/models/recent-tickers/recent-tickers-menu-item.view-model.interface";
import {useServices} from "../../hooks/use-services.hook";
import styled from "styled-components";
import {IonIcon} from "@ionic/react";
import {chevronDownOutline, chevronUpOutline} from "ionicons/icons";

const ContainerBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
`

const MenuTitleBox = styled.span`
    flex-grow: 1;
`

const ChevronBox = styled.span`
    cursor: pointer;
`

interface RecentTickersMenuItemComponentProps {
    menuItem: IRecentTickersMenuItemViewModel;
}
export const RecentTickersMenuItemComponent: React.FC<RecentTickersMenuItemComponentProps> = observer((props) => {
    const services = useServices();

    const renderChevron = () => {
        if(props.menuItem.isExpanded) {
            return (
                <IonIcon icon={chevronUpOutline}/>
            )
        } else {
            return (
                <IonIcon icon={chevronDownOutline}/>
            )
        }
    }

    return (<ContainerBox>
        <MenuTitleBox>
            {services.language.translate('Recent tickers')}
        </MenuTitleBox>

        <ChevronBox>
            {renderChevron()}
        </ChevronBox>

    </ContainerBox>)
});