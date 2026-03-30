import React from "react";
import {observer} from "mobx-react";
import {UnderlyingActivePositionsModel} from "../../underlying-active-positions.model";
import styled from "styled-components";
import {UnderlyingSymbolHeaderCellBox} from "../top-header.component";
import {PositionHeaderComponent} from "../positions/position-header.component";
import {UnderlyingComponent} from "../underlying.component";
import {PanelComponentCommonProps} from "./panel-component-common.props";


const LeftPanelBox = styled.div`
    position: sticky;
    left: -1px;
    z-index: 5;
    display: flex;
    flex-direction: column;
    background-color: var(--ion-color-primary-contrast);
`

interface LeftPanelComponentProps extends PanelComponentCommonProps {

}

export const LeftPanelComponent: React.FC<LeftPanelComponentProps> = observer((props) => {

    const renderOneUnderlying = (underlying: UnderlyingActivePositionsModel) => {
       return (<UnderlyingComponent key={underlying.symbol}
                                    underlying={underlying}
                                    isExpanded={underlying.symbol === props.expandedUnderlyingSymbol}
                                    onHeaderClick={props.onUnderlyingHeaderClick}
                                    renderHeaderContent={() => underlying.symbol}
                                    renderPositions={() => <>{underlying.activePositions.map(o => <PositionHeaderComponent key={o.id} position={o}/>)}</>}/>)
    }


    return (
        <LeftPanelBox>
            <UnderlyingSymbolHeaderCellBox>
                Symbol
            </UnderlyingSymbolHeaderCellBox>
            {props.underlyingWithOpenPositions.map(renderOneUnderlying)}
        </LeftPanelBox>
    )
})