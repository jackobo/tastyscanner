import React from "react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {HeaderCellBox} from "../top-header.component";
import {PositionHeaderComponent} from "../positions/position-header.component";
import {UnderlyingComponent} from "../underlying/underlying.component";
import {PanelComponentCommonProps} from "./panel-component-common.props";
import {IUnderlyingActivePositionsViewModel} from "../../../../services/brokers/interfaces/active-position.interfaces";


const LeftPanelBox = styled.div`
    position: sticky;
    left: -1px;
    z-index: 5;
    display: flex;
    flex-direction: column;
    background-color: var(--ion-color-primary-contrast);
`

const UnderlyingSymbolLabelHeaderCellBox = styled(HeaderCellBox)`
    position: sticky;
    top: -1px;
    background-color: var(--ion-color-primary-contrast);
    font-size: var(--ion-font-size-body2);
`

const UnderlyingSymbolBox = styled.div`
    width: 100%;
    padding-left: var(--ion-space-12);
`

interface LeftPanelComponentProps extends PanelComponentCommonProps {

}

export const LeftPanelComponent: React.FC<LeftPanelComponentProps> = observer((props) => {

    const renderOneUnderlying = (underlying: IUnderlyingActivePositionsViewModel) => {
       return (<UnderlyingComponent key={underlying.symbol}
                                    underlying={underlying}
                                    isExpanded={underlying.symbol === props.expandedUnderlyingSymbol}
                                    onHeaderClick={props.onUnderlyingHeaderClick}
                                    renderHeaderContent={() => <UnderlyingSymbolBox>{underlying.symbol}</UnderlyingSymbolBox>}
                                    renderPositions={() => <>{underlying.activePositions.map(o => <PositionHeaderComponent key={o.id} position={o}/>)}</>}/>)
    }


    return (
        <LeftPanelBox>
            <UnderlyingSymbolLabelHeaderCellBox>
                Symbol
            </UnderlyingSymbolLabelHeaderCellBox>
            {props.underlyingWithOpenPositions.map(renderOneUnderlying)}
        </LeftPanelBox>
    )
})