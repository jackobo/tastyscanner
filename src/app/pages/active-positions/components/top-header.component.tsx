import React from "react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {GridCellBox, RowBox} from "../boxes/common.boxes";
import {DELTA_SYMBOL, THETA_SYMBOL} from "../../../utils/global-constants";

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


const ColumnHeadersContainerBox = styled(RowBox)`
    position: sticky;
    top: -1px;
    font-size: var(--ion-font-size-body2);
    background-color: var(--ion-color-primary-contrast);
`

export const TopHeaderComponent: React.FC = observer(() => {
    return (
        <ColumnHeadersContainerBox>
            <CenterAlignedHeaderCellBox>DTE</CenterAlignedHeaderCellBox>
            <RightAlignedHeaderCellBox>P/L %</RightAlignedHeaderCellBox>
            <RightAlignedHeaderCellBox>P/L</RightAlignedHeaderCellBox>
            <RightAlignedHeaderCellBox>Mrk</RightAlignedHeaderCellBox>
            <RightAlignedHeaderCellBox>Trd Prc</RightAlignedHeaderCellBox>
            <RightAlignedHeaderCellBox>{DELTA_SYMBOL}</RightAlignedHeaderCellBox>
            <RightAlignedHeaderCellBox>{THETA_SYMBOL}</RightAlignedHeaderCellBox>
            <RightAlignedHeaderCellBox>Bid</RightAlignedHeaderCellBox>
            <RightAlignedHeaderCellBox>Ask</RightAlignedHeaderCellBox>
            <RightAlignedHeaderCellBox>str smb</RightAlignedHeaderCellBox>
        </ColumnHeadersContainerBox>
    )
})