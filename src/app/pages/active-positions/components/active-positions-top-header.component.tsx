import React from "react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {getCommonColumnsTemplate} from "../constants";
import {GridCellBox} from "../boxes/common.boxes";

const GridHeaderCellBox = styled(GridCellBox)`
    font-weight: var(--ion-font-weight-bold);
`

const RightAlignedHeaderGridCellBox = styled(GridHeaderCellBox)`
    text-align: right;
`

const CenterAlignedHeaderGridCellBox = styled(GridHeaderCellBox)`
    text-align: center;
`

export const UnderlyingSymbolTopHeaderBox = styled(GridHeaderCellBox)`
    position: sticky;
    top: -1px;
    background-color: var(--ion-color-primary-contrast);
    font-size: var(--ion-font-size-body2);
`


const HeaderGridBox = styled.div`
    position: sticky;
    top: -1px;
    display: grid;
    grid-template-columns: ${getCommonColumnsTemplate(false)};
    align-items: center;
    font-size: var(--ion-font-size-body2);
    background-color: var(--ion-color-primary-contrast);
    ${props => props.theme.screenMediaQuery.smallScreen} {
        width: fit-content;
        grid-template-columns: ${getCommonColumnsTemplate(true)};
    }
`

export const ActivePositionsTopHeaderComponent: React.FC = observer(() => {
    return (
        <HeaderGridBox>
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