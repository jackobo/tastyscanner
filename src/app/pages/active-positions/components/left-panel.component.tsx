import React from "react";
import {observer} from "mobx-react";
import {UnderlyingActivePositionsModel} from "../underlying-active-positions.model";
import styled from "styled-components";
import {UnderlyingSymbolTopHeaderBox} from "./active-positions-top-header.component";
import {ActiveOrderHeaderComponent} from "./active-order-header.component";
import {UnderlyingHeaderBox} from "../boxes/common.boxes";
import {NullableString} from "../../../../framework/types/nullable-types";

const LeftPanelBox = styled.div`
    position: sticky;
    left: -1px;
    z-index: 5;
    display: flex;
    flex-direction: column;
    background-color: var(--ion-color-primary-contrast);
`

const LeftPanelUnderlyingHeaderBox = styled(UnderlyingHeaderBox)`
    
`

interface UnderlyingComponentProps {
    underlying: UnderlyingActivePositionsModel;
    isSelected: boolean;
    onHeaderClick: (symbol: string) => void;
}

const UnderlyingComponent: React.FC<UnderlyingComponentProps> = observer((props) => {
    const activePositions = props.underlying.activePositions;

    const renderPositions = () => {
        if(!props.isSelected) {
            return null;
        }
        
        return (
            <>
                {activePositions.map(o => <ActiveOrderHeaderComponent key={o.id} order={o}/>)}
            </>
        )
    }

    return (
        <>
            <LeftPanelUnderlyingHeaderBox onClick={() => props.onHeaderClick(props.underlying.symbol)}>
                {props.underlying.symbol}
            </LeftPanelUnderlyingHeaderBox>
            {renderPositions()}
        </>
    )
})

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
                                    onHeaderClick={props.onUnderlyingSelected}/>)
    }


    return (
        <LeftPanelBox>
            <UnderlyingSymbolTopHeaderBox>
                Symbol
            </UnderlyingSymbolTopHeaderBox>
            {props.underlyingWithOpenPositions.map(renderOneUnderlying)}
        </LeftPanelBox>
    )
})