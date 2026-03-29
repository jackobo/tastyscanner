import styled from "styled-components";
import {GridCellBox} from "./common.boxes";
import {getCommonColumnsTemplate, LEG_INFO_WIDTH} from "./constants";

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
    grid-template-columns: ${LEG_INFO_WIDTH} ${props => getCommonColumnsTemplate(false)};
    align-items: center;
    width: 100%;
    font-size: var(--ion-font-size-h6);
    ${props => props.theme.screenMediaQuery.smallScreen} {
        width: fit-content;
        grid-template-columns: ${LEG_INFO_WIDTH} ${props => getCommonColumnsTemplate(true)};
    }
`
