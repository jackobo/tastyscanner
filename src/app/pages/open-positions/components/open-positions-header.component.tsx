import React from "react";
import {observer} from "mobx-react";
import {
    CenterAlignedHeaderGridCellBox,
    HeaderGridBox,
    LegInfoHeaderGridCellBox,
    RightAlignedHeaderGridCellBox
} from "../boxes/grid-header.boxes";

export const HeaderComponent: React.FC = observer(() => {
    return (
        <HeaderGridBox>
            <LegInfoHeaderGridCellBox>Symbol</LegInfoHeaderGridCellBox>
            <CenterAlignedHeaderGridCellBox>DTE</CenterAlignedHeaderGridCellBox>
            <RightAlignedHeaderGridCellBox>Mrk</RightAlignedHeaderGridCellBox>
            <RightAlignedHeaderGridCellBox>Trd Prc</RightAlignedHeaderGridCellBox>
            <RightAlignedHeaderGridCellBox>Bid</RightAlignedHeaderGridCellBox>
            <RightAlignedHeaderGridCellBox>Ask</RightAlignedHeaderGridCellBox>
        </HeaderGridBox>
    )
})