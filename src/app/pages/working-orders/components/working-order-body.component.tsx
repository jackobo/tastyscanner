import React, {useRef} from "react";
import {IWorkingOrderViewModel} from "../../../services/brokers/interfaces/working-order.interfaces";
import {observer} from "mobx-react";
import {useServices} from "../../../hooks/use-services.hook";
import styled from "styled-components";
import {IonIcon} from "@ionic/react";
import {repeatOutline} from "ionicons/icons";
import {
    ITooltipController,
    TooltipComponent,
    TooltipToggleBehaviorEnum
} from "../../../../framework/components/tooltip/tooltip.component";
import {ReplaceWorkingOrderComponent} from "./replace-working-order.component";
import {Price} from "../../../models/price/price";

const BodyBox = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: var(--ion-space-16);
    width: 100%;
`

const PriceContainerBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 2px;
`

const PriceValueBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    font-weight: var(--ion-font-weight-bold);
`

const TradingPriceValueBox = styled.div<{$isReadOnly: boolean}>`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--ion-space-8);
    cursor: ${props => props.$isReadOnly ? "default" : "pointer"};
`

const ReplaceButtonBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
`

const ReplaceButtonToolTipContentBox = styled.div`
    padding: var(--ion-space-16);
    font-size: var(--ion-font-size-body2);
`

interface OrderPriceComponentProps {
    workingOrder: IWorkingOrderViewModel;
    label: string;
    tooltipText?: string;
    getPrice: () => Price;
    isReadOnly: boolean;
    isPriceInitiallyLocked: boolean;
}

const OrderPriceComponent: React.FC<OrderPriceComponentProps> = observer((props) => {
    const tradingPriceValueElementRef = useRef<HTMLDivElement | null>(null);
    const replaceButtonElementRef = useRef<HTMLDivElement | null>(null);
    const replaceWorkingOrderTooltipControllerRef = useRef<ITooltipController | null>(null);

    const renderReplaceButton = () => {
        if(props.isReadOnly) {
            return null;
        }
        return (
            <ReplaceButtonBox ref={replaceButtonElementRef}>
                <IonIcon icon={repeatOutline}/>
            </ReplaceButtonBox>
        )
    }



    return (
        <PriceContainerBox>
            <div>{props.label}</div>
            <TradingPriceValueBox ref={tradingPriceValueElementRef} $isReadOnly={Boolean(props.isReadOnly)}>
                <PriceValueBox>
                    {props.getPrice().toString()}
                </PriceValueBox>

                {renderReplaceButton()}
            </TradingPriceValueBox>


            <TooltipComponent targetRef={tradingPriceValueElementRef}
                              toggleBehavior={TooltipToggleBehaviorEnum.OnTargetClick}
                              tooltipControllerRef={replaceWorkingOrderTooltipControllerRef}>
                <ReplaceWorkingOrderComponent workingOrder={props.workingOrder}
                                              initialPriceValue={props.getPrice()}
                                              isPriceInitiallyLocked={props.isPriceInitiallyLocked}
                                              onCloseClick={() => replaceWorkingOrderTooltipControllerRef.current?.close()}/>
            </TooltipComponent>

            <TooltipComponent targetRef={replaceButtonElementRef}
                              toggleBehavior={TooltipToggleBehaviorEnum.OnTargetMouseEnterLeave}>
                <ReplaceButtonToolTipContentBox>
                    {props.tooltipText}
                </ReplaceButtonToolTipContentBox>
            </TooltipComponent>


        </PriceContainerBox>
    );
})

export const WokingOrderBodyComponent: React.FC<{workingOrder: IWorkingOrderViewModel;isReadOnly?: boolean;}> = observer((props) => {
    const services = useServices();





    return (
        <BodyBox>
            <OrderPriceComponent workingOrder={props.workingOrder}
                                 label={services.language.translate('Trading price')}
                                 getPrice={() => props.workingOrder.tradingPrice}
                                 tooltipText={services.language.translate('Replace order starting with Trading price')}
                                 isReadOnly={Boolean(props.isReadOnly)}
                                 isPriceInitiallyLocked={true}/>

            <OrderPriceComponent workingOrder={props.workingOrder}
                                 label={services.language.translate('Mid price')}
                                 getPrice={() => props.workingOrder.midPrice ?? props.workingOrder.tradingPrice}
                                 tooltipText={services.language.translate('Replace order starting with Mid price')}
                                 isReadOnly={Boolean(props.isReadOnly)}
                                 isPriceInitiallyLocked={false}/>
        </BodyBox>
    )
});