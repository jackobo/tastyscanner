import React from "react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {UnderlyingActivePositionsModel} from "../../underlying-active-positions.model";
import {TopHeaderComponent} from "../top-header.component";
import {PositionDetailsComponent} from "../positions/position-details.component";
import {UnderlyingComponent} from "../underlying.component";
import {PanelComponentCommonProps} from "./panel-component-common.props";

const RightPanelBox = styled.div`
    display: flex;
    flex-direction: column;
`


interface RightPanelComponentProps extends PanelComponentCommonProps{

}

export const RightPanelComponent: React.FC<RightPanelComponentProps> = observer((props) => {

    const renderOneUnderlying = (underlying: UnderlyingActivePositionsModel) => {
        return (<UnderlyingComponent key={underlying.symbol}
                                     underlying={underlying}
                                     isExpanded={underlying.symbol === props.expandedUnderlyingSymbol}
                                     onHeaderClick={props.onUnderlyingHeaderClick}
                                     renderHeaderContent={() => ""}
                                     renderPositions={() => <>{underlying.activePositions.map(position => <PositionDetailsComponent key={position.id} position={position}/>)}</>}/>)
    }

    return (
        <RightPanelBox>
            <TopHeaderComponent/>
            {props.underlyingWithOpenPositions.map(renderOneUnderlying)}
        </RightPanelBox>
    )
})