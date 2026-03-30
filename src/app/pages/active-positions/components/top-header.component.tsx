import React from "react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {GridCellBox, RowBox} from "../boxes/common.boxes";
import {DELTA_SYMBOL, THETA_SYMBOL} from "../../../utils/global-constants";

export const HeaderCellBox = styled(GridCellBox)`
    font-weight: var(--ion-font-weight-bold);
`

export const RightAlignedHeaderCellBox = styled(HeaderCellBox)`
    text-align: right;
`

export const CenterAlignedHeaderCellBox = styled(HeaderCellBox)`
    text-align: center;
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
        </ColumnHeadersContainerBox>
    )
})