import React from "react";
import {observer} from "mobx-react";
import {
    IActivePositionLegViewModel,
    IActivePositionViewModel
} from "../../../services/brokers/interfaces/active-position.interfaces";
import styled from "styled-components";
import {getCommonColumnsTemplate} from "../constants";
import {CenterAlignedBodyGridCellBox, RightAlignedBodyGridCellBox} from "../boxes/grid-body.boxes";

const ContainerBox = styled.div`
    display: grid;
    grid-template-columns: ${getCommonColumnsTemplate(false)};
    align-items: center;
    ${props => props.theme.screenMediaQuery.smallScreen} {
        grid-template-columns: ${getCommonColumnsTemplate(true)};
    }
`

const LegLevelValuesComponent: React.FC<{leg: IActivePositionLegViewModel}> = observer((props) => {

    return (
        <>
            <CenterAlignedBodyGridCellBox>{props.leg.daysToExpiration}</CenterAlignedBodyGridCellBox>
            <RightAlignedBodyGridCellBox>{`${props.leg.profitLossPercent.toFixed(2)}%`}</RightAlignedBodyGridCellBox>
            <RightAlignedBodyGridCellBox>{props.leg.profitLoss.toFixed(2)}</RightAlignedBodyGridCellBox>
            <RightAlignedBodyGridCellBox>{props.leg.marketPrice.toFixed(2)}</RightAlignedBodyGridCellBox>
            <RightAlignedBodyGridCellBox>{props.leg.tradingPrice.toFixed(2)}</RightAlignedBodyGridCellBox>
            <RightAlignedBodyGridCellBox>{props.leg.bidPrice?.toFixed(2)}</RightAlignedBodyGridCellBox>
            <RightAlignedBodyGridCellBox>{props.leg.askPrice?.toFixed(2)}</RightAlignedBodyGridCellBox>
            <RightAlignedBodyGridCellBox/>
        </>
    )
})

const OrderLevelValuesComponent: React.FC<{order: IActivePositionViewModel}> = observer(props => {
    return (
        <>
            <CenterAlignedBodyGridCellBox>
                {props.order.daysToExpiration}
            </CenterAlignedBodyGridCellBox>

            <RightAlignedBodyGridCellBox>
                {`${props.order.profitLossPercent.toFixed(2)}%`}
            </RightAlignedBodyGridCellBox>

            <RightAlignedBodyGridCellBox>
                {props.order.profitLoss.toFixed(2)}
            </RightAlignedBodyGridCellBox>


            <RightAlignedBodyGridCellBox>
                {props.order.marketPrice.toFixed(2)}
            </RightAlignedBodyGridCellBox>

            <RightAlignedBodyGridCellBox>
                {props.order.tradingPrice.toFixed(2)}
            </RightAlignedBodyGridCellBox>

            <RightAlignedBodyGridCellBox>

            </RightAlignedBodyGridCellBox>
            <RightAlignedBodyGridCellBox>
            </RightAlignedBodyGridCellBox>
            <RightAlignedBodyGridCellBox>
            </RightAlignedBodyGridCellBox>
        </>
    )
})

export const ActiveOrderDetailsComponent: React.FC<{order: IActivePositionViewModel}> = observer((props) => {
    const legs = props.order.legs;
    return (
        <ContainerBox>
            <OrderLevelValuesComponent order={props.order}/>
            {legs.map((leg) => (<LegLevelValuesComponent key={leg.symbol} leg={leg}/>))}
        </ContainerBox>
    )
})