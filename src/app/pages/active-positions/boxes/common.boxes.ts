import styled from "styled-components";

export const GridCellBox = styled.div`
    padding: var(--ion-space-8);
    white-space: nowrap;
`

export const UnderlyingHeaderBox = styled(GridCellBox)`
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: var(--ion-color-light-shade);
    color: var(--ion-color-light-contrast);
    font-weight: var(--ion-font-weight-bold);
    border-bottom: 1px solid var(--ion-color-light);
    height: 48px;
    width: 100%;
    cursor: pointer;
`