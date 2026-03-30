import styled from "styled-components";
import {GridCellBox} from "./common.boxes";


export const GridBodyCellBox = styled(GridCellBox)`
    border-bottom: 1px solid var(--ion-color-border);
    height: 100%;
`

export const RightAlignedBodyGridCellBox = styled(GridBodyCellBox)`
    text-align: right;
`

export const CenterAlignedBodyGridCellBox = styled(GridBodyCellBox)`
    text-align: center;
`




