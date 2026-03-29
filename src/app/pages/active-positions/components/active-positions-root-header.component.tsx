import React from "react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {getCommonColumnsTemplate, UNDERLYING_SYMBOL_WIDTH} from "../constants";
import {GridCellBox} from "../boxes/common.boxes";

export const GridHeaderCellBox = styled(GridCellBox)`
    font-weight: var(--ion-font-weight-bold);
`

export const RightAlignedHeaderGridCellBox = styled(GridHeaderCellBox)`
    text-align: right;
`

export const CenterAlignedHeaderGridCellBox = styled(GridHeaderCellBox)`
    text-align: center;
`



export const HeaderGridBox = styled.div`
    display: grid;
    grid-template-columns: ${UNDERLYING_SYMBOL_WIDTH} ${getCommonColumnsTemplate(false)};
    align-items: center;
    width: 100%;
    font-size: var(--ion-font-size-h6);
    ${props => props.theme.screenMediaQuery.smallScreen} {
        width: fit-content;
        grid-template-columns: ${UNDERLYING_SYMBOL_WIDTH} ${getCommonColumnsTemplate(true)};
    }
`


export const UnderlyingSymbolBox = styled(GridHeaderCellBox)`
    width: ${UNDERLYING_SYMBOL_WIDTH};
`

export const ActivePositionsRootHeaderComponent: React.FC = observer(() => {
    return (
        <HeaderGridBox>
            <UnderlyingSymbolBox>Symbol</UnderlyingSymbolBox>
            <CenterAlignedHeaderGridCellBox>DTE</CenterAlignedHeaderGridCellBox>
            <RightAlignedHeaderGridCellBox>P/L %</RightAlignedHeaderGridCellBox>
            <RightAlignedHeaderGridCellBox>P/L</RightAlignedHeaderGridCellBox>
            <RightAlignedHeaderGridCellBox>Mrk</RightAlignedHeaderGridCellBox>
            <RightAlignedHeaderGridCellBox>Trd Prc</RightAlignedHeaderGridCellBox>
            <RightAlignedHeaderGridCellBox>Bid</RightAlignedHeaderGridCellBox>
            <RightAlignedHeaderGridCellBox>Ask</RightAlignedHeaderGridCellBox>
        </HeaderGridBox>
    )
})