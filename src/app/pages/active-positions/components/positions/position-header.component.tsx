import React from "react";
import {observer} from "mobx-react";
import styled, {css} from "styled-components";
import {GridBodyCellBox} from "../../boxes/grid-body.boxes";
import {
    IActivePositionLegViewModel,
    IActivePositionViewModel
} from "../../../../services/brokers/interfaces/active-position.interfaces";
import {useServices} from "../../../../hooks/use-services.hook";
import {UNDERLYING_SYMBOL_WIDTH} from "../../constants";

const ContainerBox = styled.div`
    display: flex;
    flex-direction: column;
    width: ${UNDERLYING_SYMBOL_WIDTH};
`

const LegContainerBox = styled(GridBodyCellBox)<{$isSell: boolean}>`
    display: grid;
    grid-template-columns: 15px 1px 6px 1px 40px 1px 30px;
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

const LegValueBox = styled.div`
    width: 100%;
    text-align: center;
`

const LegValuePipeSeparatorBox = styled.span<{$isSell: boolean}>`
    display: flex;
    height: 90%;
    border-right: 1px solid var(--ion-color-dark);
    ${props => props.$isSell
            ? css`
                border-right: 1px solid var(--ion-color-danger-contrast);
            `
            : css`
                border-right: 1px solid var(--ion-color-success-contrast);
            `
    }
`

const LegComponent: React.FC<{leg: IActivePositionLegViewModel}> = observer((props) => {
    const services = useServices();
    return (
        <LegContainerBox $isSell={props.leg.isSell}>
            <LegValueBox>{props.leg.quantity}</LegValueBox>
            <LegValuePipeSeparatorBox $isSell={props.leg.isSell}/>
            <LegValueBox>{props.leg.optionType}</LegValueBox>
            <LegValuePipeSeparatorBox $isSell={props.leg.isSell}/>
            <LegValueBox>{services.time.formatUserFriendlyMonthDay(props.leg.expirationDate)}</LegValueBox>
            <LegValuePipeSeparatorBox $isSell={props.leg.isSell}/>
            <LegValueBox>{props.leg.strikePrice}</LegValueBox>
        </LegContainerBox>
    );
})


export const PositionHeaderComponent: React.FC<{position: IActivePositionViewModel}> = observer((props) => {
    const legs = props.position.legs;
    return (
        <ContainerBox>
            <GridBodyCellBox>
                {`Order ID: ${props.position.id}`}
            </GridBodyCellBox>
            {legs.map((leg) => (<LegComponent key={leg.symbol} leg={leg}/>))}
        </ContainerBox>
    );
})