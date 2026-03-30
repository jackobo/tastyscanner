import styled from "styled-components";
import {getCommonColumnsTemplate} from "../constants";

export const GridCellBox = styled.div`
    padding: var(--ion-space-8);
    white-space: nowrap;
`

export const RowBox = styled.div`
    display: grid;
    grid-template-columns: ${getCommonColumnsTemplate(false)};
    align-items: center;
    min-width: 100%;
    ${props => props.theme.screenMediaQuery.smallScreen} {
        grid-template-columns: ${getCommonColumnsTemplate(true)};
    }
    
`