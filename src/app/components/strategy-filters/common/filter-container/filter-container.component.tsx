import React, {PropsWithChildren} from "react";
import {observer} from "mobx-react";
import styled, {css} from "styled-components";

const FilterContainerBox = styled.div<{$hideBorder?: boolean}>`
    width: 100%;
    font-size: var(--ion-font-size-body2);
    ${props => !props.$hideBorder && css`
            border-bottom: 1px solid var(--ion-color-border);
    `}
    
`

const FilterContentBox = styled.div`
    display: flex;
    flex-direction: column;
    gap:4px;
    padding: var(--ion-space-12) var(--ion-space-12) 0 var(--ion-space-12);
`

interface FilterContainerComponentProps extends PropsWithChildren {
    hideBorder?: boolean;
}
export const FilterContainerComponent: React.FC<FilterContainerComponentProps> = observer((props) => {
    return (
        <FilterContainerBox $hideBorder={props.hideBorder}>
            <FilterContentBox>
                {props.children}
            </FilterContentBox>
        </FilterContainerBox>
    )
})