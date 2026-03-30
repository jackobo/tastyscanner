import React from "react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {UnderlyingActivePositionsModel} from "../underlying-active-positions.model";
import {ActivePositionsTopHeaderComponent} from "./active-positions-top-header.component";
import {ActiveOrderDetailsComponent} from "./active-order-details.component";
import {UnderlyingHeaderBox} from "../boxes/common.boxes";
import {NullableString} from "../../../../framework/types/nullable-types";

const RightPanelBox = styled.div`
    display: flex;
    flex-direction: column;
`

const RightPanelUnderlyingHeaderBox = styled(UnderlyingHeaderBox)`
    
`

interface UnderlyingComponentProps {
    underlying: UnderlyingActivePositionsModel;
    isSelected: boolean;
    onHeaderClick: (symbol: string) => void;
}
const UnderlyingComponent: React.FC<UnderlyingComponentProps> = observer((props) => {
    const orders = props.underlying.activePositions;

    const renderPositions = () => {
        if(!props.isSelected) {
            return null;
        }

        return (
            <>
                {orders.map(o => <ActiveOrderDetailsComponent key={o.id} order={o}/>)}
            </>
        )
    }

    return (
        <React.Fragment key={props.underlying.symbol}>

            <RightPanelUnderlyingHeaderBox onClick={() => props.onHeaderClick(props.underlying.symbol)}>

            </RightPanelUnderlyingHeaderBox>
            {renderPositions()}
        </React.Fragment>
    )
})


interface RightPanelComponentProps {
    selectedUnderlyingSymbol: NullableString;
    underlyingWithOpenPositions: UnderlyingActivePositionsModel[];
    onUnderlyingSelected: (underlyingSymbol: string) => void;
}

export const RightPanelComponent: React.FC<RightPanelComponentProps> = observer((props) => {

    const renderOneUnderlying = (underlying: UnderlyingActivePositionsModel) => {
        return (<UnderlyingComponent key={underlying.symbol}
                                     underlying={underlying}
                                     isSelected={underlying.symbol === props.selectedUnderlyingSymbol}
                                     onHeaderClick={props.onUnderlyingSelected}/>)
    }

    return (
        <RightPanelBox>
            <ActivePositionsTopHeaderComponent/>
            {props.underlyingWithOpenPositions.map(renderOneUnderlying)}
        </RightPanelBox>
    )
})