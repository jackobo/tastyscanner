import styled, {css} from "styled-components";
import {getCommonColumnsTemplate, UNDERLYING_SYMBOL_WIDTH} from "../constants";
import {GridCellBox} from "./common.boxes";

export const BodyGridBox = styled.div`
    display: grid;
    grid-template-columns: ${UNDERLYING_SYMBOL_WIDTH} ${props => getCommonColumnsTemplate(false)};
    align-items: center;
    ${props => props.theme.screenMediaQuery.smallScreen} {
        grid-template-columns: ${UNDERLYING_SYMBOL_WIDTH} ${props => getCommonColumnsTemplate(true)};
    }
`

export const GridBodyCellBox = styled(GridCellBox)`
    border-bottom: 1px solid var(--ion-color-border);
`

export const RightAlignedBodyGridCellBox = styled(GridBodyCellBox)`
    text-align: right;
`

export const CenterAlignedBodyGridCellBox = styled(GridBodyCellBox)`
    text-align: center;
`




