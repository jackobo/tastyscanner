import React from "react";
import {observer} from "mobx-react";
import {UnderlyingActivePositionsModel} from "../../underlying-active-positions.model";
import styled from "styled-components";
import {UnderlyingSymbolHeaderCellBox} from "../top-header.component";
import {PositionHeaderComponent} from "../positions/position-header.component";
import {NullableString} from "../../../../../framework/types/nullable-types";
import {UnderlyingComponent} from "../underlying.component";


const LeftPanelBox = styled.div`
    position: sticky;
    left: -1px;
    z-index: 5;
    display: flex;
    flex-direction: column;
    background-color: var(--ion-color-primary-contrast);
`

interface LeftPanelComponentProps {
    selectedUnderlyingSymbol: NullableString;
    underlyingWithOpenPositions: UnderlyingActivePositionsModel[];
    onUnderlyingSelected: (underlyingSymbol: string) => void;
}

export const LeftPanelComponent: React.FC<LeftPanelComponentProps> = observer((props) => {

    const renderOneUnderlying = (underlying: UnderlyingActivePositionsModel) => {
       return (<UnderlyingComponent key={underlying.symbol}
                                    underlying={underlying}
                                    isSelected={underlying.symbol === props.selectedUnderlyingSymbol}
                                    onHeaderClick={props.onUnderlyingSelected}
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