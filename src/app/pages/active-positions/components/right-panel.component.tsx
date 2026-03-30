import React from "react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {UnderlyingActivePositionsModel} from "../underlying-active-positions.model";
import {ActivePositionsTopHeaderComponent} from "./active-positions-top-header.component";
import {ActiveOrderDetailsComponent} from "./active-order-details.component";
import {NullableString} from "../../../../framework/types/nullable-types";
import {UnderlyingComponent} from "./underlying.component";

const RightPanelBox = styled.div`
    display: flex;
    flex-direction: column;
`


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
                                     onHeaderClick={props.onUnderlyingSelected}
                                     renderHeaderContent={() => ""}
                                     renderPositions={() => <>{underlying.activePositions.map(o => <ActiveOrderDetailsComponent key={o.id} order={o}/>)}</>}/>)
    }

    return (
        <RightPanelBox>
            <ActivePositionsTopHeaderComponent/>
            {props.underlyingWithOpenPositions.map(renderOneUnderlying)}
        </RightPanelBox>
    )
})