import React from "react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {ITickerViewModel} from "../models/ticker.view-model.interface";
import {EarningsDatePositionEnum} from "./transactions/helper-functions";

const ContainerBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    padding: 8px 0;
`

const LineBox= styled.div`
    flex-grow: 1;
    height: 2px;
    background-color: var(--ion-color-danger);
`

const EarningsDateBox = styled.div`
    background-color: var(--ion-color-danger);
    color: var(--ion-color-danger-contrast);
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 0.8rem;
`

export const EarningsDateMarkerComponent: React.FC<{earningsDate: string; daysUntilEarnings: number}> = observer((props) => {
    return (
        <ContainerBox>
            <LineBox/>
            <EarningsDateBox>
                {`Earnings date: ${props.earningsDate} (${props.daysUntilEarnings} days)`}
            </EarningsDateBox>
        </ContainerBox>
    )
});

export const EarningsDateMarkerBeforeExpirationComponent: React.FC<{ticker: ITickerViewModel; position: EarningsDatePositionEnum}> = observer((props) => {
    if(props.position !== EarningsDatePositionEnum.Before) {
        return null;
    }

    return (
        <EarningsDateMarkerComponent earningsDate={props.ticker.earningsDate} daysUntilEarnings={props.ticker.daysUntilEarnings}/>
    )

})

export const EarningsDateMarkerAfterExpirationComponent: React.FC<{ticker: ITickerViewModel; position: EarningsDatePositionEnum}> = observer((props) => {
    if(props.position !== EarningsDatePositionEnum.After) {
        return null;
    }

    return (
        <EarningsDateMarkerComponent earningsDate={props.ticker.earningsDate} daysUntilEarnings={props.ticker.daysUntilEarnings}/>
    )

})