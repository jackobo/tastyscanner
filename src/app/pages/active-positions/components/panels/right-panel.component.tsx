import React from "react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {CenterAlignedHeaderCellBox, RightAlignedHeaderCellBox, TopHeaderComponent} from "../top-header.component";
import {PositionDetailsComponent} from "../positions/position-details.component";
import {UnderlyingComponent} from "../underlying/underlying.component";
import {PanelComponentCommonProps} from "./panel-component-common.props";
import {IUnderlyingActivePositionsViewModel} from "../../../../services/brokers/interfaces/active-position.interfaces";
import {RowBox} from "../../boxes/common.boxes";

const RightPanelBox = styled.div`
    display: flex;
    flex-direction: column;
`

const UnderlyingHeaderValuesBox = styled(RowBox)`
    
`

const UnderlyingValuesComponent: React.FC<{underlying: IUnderlyingActivePositionsViewModel}> = observer((props) => {
    return (
        <UnderlyingHeaderValuesBox>
            <CenterAlignedHeaderCellBox>{props.underlying.daysToExpiration}</CenterAlignedHeaderCellBox>
            <RightAlignedHeaderCellBox></RightAlignedHeaderCellBox>
            <RightAlignedHeaderCellBox></RightAlignedHeaderCellBox>
            <RightAlignedHeaderCellBox></RightAlignedHeaderCellBox>
            <RightAlignedHeaderCellBox></RightAlignedHeaderCellBox>
            <RightAlignedHeaderCellBox>{props.underlying.delta}</RightAlignedHeaderCellBox>
            <RightAlignedHeaderCellBox>{props.underlying.theta}</RightAlignedHeaderCellBox>
            <RightAlignedHeaderCellBox></RightAlignedHeaderCellBox>
            <RightAlignedHeaderCellBox></RightAlignedHeaderCellBox>
            <RightAlignedHeaderCellBox></RightAlignedHeaderCellBox>
        </UnderlyingHeaderValuesBox>
    )
})


interface RightPanelComponentProps extends PanelComponentCommonProps{

}

export const RightPanelComponent: React.FC<RightPanelComponentProps> = observer((props) => {

    const renderOneUnderlying = (underlying: IUnderlyingActivePositionsViewModel) => {
        return (<UnderlyingComponent key={underlying.symbol}
                                     underlying={underlying}
                                     isExpanded={underlying.symbol === props.expandedUnderlyingSymbol}
                                     onHeaderClick={props.onUnderlyingHeaderClick}
                                     renderHeaderContent={() => (<UnderlyingValuesComponent underlying={underlying}/>)}
                                     renderPositions={() => <>{underlying.activePositions.map(position => <PositionDetailsComponent key={position.id} position={position}/>)}</>}/>)
    }

    return (
        <RightPanelBox>
            <TopHeaderComponent/>
            {props.underlyingWithOpenPositions.map(renderOneUnderlying)}
        </RightPanelBox>
    )
})