import React from "react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {getCommonColumnsTemplate} from "../constants";
import {GridCellBox} from "../boxes/common.boxes";

const HeaderCellBox = styled(GridCellBox)`
    font-weight: var(--ion-font-weight-bold);
`

const RightAlignedHeaderCellBox = styled(HeaderCellBox)`
    text-align: right;
`

const CenterAlignedHeaderCellBox = styled(HeaderCellBox)`
    text-align: center;
`

export const UnderlyingSymbolHeaderCellBox = styled(HeaderCellBox)`
    position: sticky;
    top: -1px;
    background-color: var(--ion-color-primary-contrast);
    font-size: var(--ion-font-size-body2);
`


const ColumnHeadersContainerBox = styled.div`
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
        <ColumnHeadersContainerBox>
            <CenterAlignedHeaderCellBox>DTE</CenterAlignedHeaderCellBox>
            <RightAlignedHeaderCellBox>P/L %</RightAlignedHeaderCellBox>
            <RightAlignedHeaderCellBox>P/L</RightAlignedHeaderCellBox>
            <RightAlignedHeaderCellBox>Mrk</RightAlignedHeaderCellBox>
            <RightAlignedHeaderCellBox>Trd Prc</RightAlignedHeaderCellBox>
            <RightAlignedHeaderCellBox>Bid</RightAlignedHeaderCellBox>
            <RightAlignedHeaderCellBox>Ask</RightAlignedHeaderCellBox>
        </ColumnHeadersContainerBox>
    )
})