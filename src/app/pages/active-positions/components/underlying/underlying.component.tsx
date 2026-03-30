import React from "react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {IUnderlyingActivePositionsViewModel} from "../../../../services/brokers/interfaces/active-position.interfaces";


const UnderlyingHeaderBox = styled.div`
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

interface UnderlyingComponentProps {
    underlying: IUnderlyingActivePositionsViewModel;
    isExpanded: boolean;
    onHeaderClick: (symbol: string) => void;
    renderHeaderContent: () => React.ReactElement | string;
    renderPositions: () => React.ReactElement;
}
export const UnderlyingComponent: React.FC<UnderlyingComponentProps> = observer((props) => {
    const renderPositions = () => {
        if(props.isExpanded) {
            return props.renderPositions();
        }

        return null;

    }
    return (
        <>
            <UnderlyingHeaderBox onClick={() => props.onHeaderClick(props.underlying.symbol)}>
                {props.renderHeaderContent()}
            </UnderlyingHeaderBox>
            {renderPositions()}

        </>

    )
})