import styled from "styled-components";
import {GridCellBox} from "./common.boxes";
import {COMMON_COLUMNS_TEMPLATE, LEG_INFO_WIDTH} from "./constants";

export const GridHeaderCellBox = styled(GridCellBox)`
    font-weight: var(--ion-font-weight-bold);
`

export const RightAlignedHeaderGridCellBox = styled(GridHeaderCellBox)`
    text-align: right;
`

export const CenterAlignedHeaderGridCellBox = styled(GridHeaderCellBox)`
    text-align: center;
`

export const LegInfoHeaderGridCellBox = styled(GridHeaderCellBox)`
`

export const HeaderGridBox = styled.div`
    display: grid;
    grid-template-columns: ${LEG_INFO_WIDTH} ${COMMON_COLUMNS_TEMPLATE};
    align-items: center;
    width: 100%;
    font-size: var(--ion-font-size-h6);
`
