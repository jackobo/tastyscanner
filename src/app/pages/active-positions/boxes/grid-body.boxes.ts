import styled, {css} from "styled-components";
import {COMMON_COLUMNS_TEMPLATE, LEG_INFO_WIDTH} from "./constants";
import {GridCellBox} from "./common.boxes";

export const BodyGridBox = styled.div`
    display: grid;
    grid-template-columns: ${LEG_INFO_WIDTH} ${COMMON_COLUMNS_TEMPLATE};
    align-items: center;
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

export const LegInfoGridCellBox = styled.div`
    width: 100%;
    text-align: center;
`


export const LegInfoBodyGridCellBox = styled(GridBodyCellBox)<{$isSell: boolean}>`
    display: grid;
    grid-template-columns: 15px auto 10px auto 45px auto 38px;
    flex-direction: row;
    align-items: center;
    justify-items: center;
    justify-content: space-evenly;
    gap: var(--ion-space-8);
    ${props => props.$isSell 
            ? css`
                background-color: var(--ion-color-danger-shade);
                color: var(--ion-color-danger-contrast);
            `
            : css`
                background-color: var(--ion-color-success-shade);
                color: var(--ion-color-success-contrast);
            `
    }
  
    
`