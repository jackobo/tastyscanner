import React from "react";
import {observer} from "mobx-react";
import {
    IActivePositionLegViewModel,
    IActivePositionViewModel
} from "../../../../services/brokers/interfaces/active-position.interfaces";
import styled from "styled-components";
import {CenterAlignedBodyGridCellBox, RightAlignedBodyGridCellBox} from "../../boxes/grid-body.boxes";
import {RowBox} from "../../boxes/common.boxes";
import {NullableNumber} from "../../../../../framework/types/nullable-types";
import {DELTA_SYMBOL, THETA_SYMBOL} from "../../../../utils/global-constants";

const ContainerBox = styled.div`
    display: flex;
    flex-direction: column;
`

const ValuesRowBox = styled(RowBox)`
    &:hover {
        background-color: var(--ion-color-light);
        color: var(--ion-color-light-contrast);
    }
`

interface ValuesComponentProps {
    daysToExpiration: NullableNumber;
    profitLossPercent: number;
    profitLoss: number;
    marketPrice: number;
    tradingPrice: number;
    tradingCost: number;
    bidPrice: NullableNumber;
    askPrice: NullableNumber;
    delta: NullableNumber;
    theta: NullableNumber;
}


const ValuesComponent: React.FC<ValuesComponentProps> = observer((props) => {
    return (
        <ValuesRowBox>
            <CenterAlignedBodyGridCellBox>{props.daysToExpiration}</CenterAlignedBodyGridCellBox>
            <RightAlignedBodyGridCellBox>{`${props.profitLossPercent.toFixed(2)}%`}</RightAlignedBodyGridCellBox>
            <RightAlignedBodyGridCellBox>{props.profitLoss.toFixed(2)}</RightAlignedBodyGridCellBox>
            <RightAlignedBodyGridCellBox>{props.marketPrice.toFixed(2)}</RightAlignedBodyGridCellBox>
            <RightAlignedBodyGridCellBox>{props.tradingPrice.toFixed(2)}</RightAlignedBodyGridCellBox>
            <RightAlignedBodyGridCellBox>{props.tradingCost.toFixed(2)}</RightAlignedBodyGridCellBox>
            <RightAlignedBodyGridCellBox>{`${props.delta?.toFixed(2) ?? ""} ${DELTA_SYMBOL}`}</RightAlignedBodyGridCellBox>
            <RightAlignedBodyGridCellBox>{`${props.theta?.toFixed(2) ?? ""} ${THETA_SYMBOL}`}</RightAlignedBodyGridCellBox>
            <RightAlignedBodyGridCellBox>{props.bidPrice?.toFixed(2)}</RightAlignedBodyGridCellBox>
            <RightAlignedBodyGridCellBox>{props.askPrice?.toFixed(2)}</RightAlignedBodyGridCellBox>
        </ValuesRowBox>
    )
})

const LegValuesComponent: React.FC<{leg: IActivePositionLegViewModel}> = observer((props) => {

    return (
        <ValuesComponent daysToExpiration={props.leg.daysToExpiration}
                         profitLossPercent={props.leg.profitLossPercent}
                         profitLoss={props.leg.profitLoss}
                         marketPrice={props.leg.marketPrice}
                         tradingPrice={props.leg.tradingPrice}
                         tradingCost={props.leg.tradingCost}
                         delta={props.leg.delta}
                         theta={props.leg.theta}
                         bidPrice={props.leg.bidPrice}
                         askPrice={props.leg.askPrice}/>
    )
})

const PositionValuesComponent: React.FC<{position: IActivePositionViewModel}> = observer(props => {
    return (
        <ValuesComponent daysToExpiration={props.position.daysToExpiration}
                         profitLossPercent={props.position.profitLossPercent}
                         profitLoss={props.position.profitLoss}
                         marketPrice={props.position.marketPrice}
                         tradingPrice={props.position.tradingPrice}
                         tradingCost={props.position.tradingCost}
                         delta={props.position.delta}
                         theta={props.position.theta}
                         bidPrice={null}
                         askPrice={null}/>
    );
})

export const PositionDetailsComponent: React.FC<{position: IActivePositionViewModel}> = observer((props) => {
    const legs = props.position.legs;
    return (
        <ContainerBox>
            <PositionValuesComponent position={props.position}/>
            {legs.map((leg) => (<LegValuesComponent key={leg.symbol} leg={leg}/>))}
        </ContainerBox>
    )
})