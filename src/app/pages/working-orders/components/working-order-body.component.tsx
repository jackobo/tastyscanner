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

const BodyBox = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: var(--ion-space-16);
`

const PriceContainerBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 2px;
`

const TradingPriceValueBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--ion-space-8);
    cursor: pointer;
`

const ReplaceButtonBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`

const ReplaceButtonToolTipContentBox = styled.div`
    padding: var(--ion-space-16);
    font-size: var(--ion-font-size-body2);
`


export const WokingOrderBodyComponent: React.FC<{workingOrder: IWorkingOrderViewModel}> = observer((props) => {
    const services = useServices();
    const tradingPriceValueElementRef = useRef<HTMLDivElement | null>(null);
    const replaceButtonElementRef = useRef<HTMLDivElement | null>(null);
    const replaceWorkingOrderTooltipControllerRef = useRef<ITooltipController | null>(null);
    return (
        <BodyBox>
            <PriceContainerBox>
                <div>{services.language.translate('Trading price')}</div>
                <TradingPriceValueBox ref={tradingPriceValueElementRef}>
                    <div>{props.workingOrder.tradingPrice.toFixed(2)}</div>
                    <ReplaceButtonBox ref={replaceButtonElementRef}>
                        <IonIcon icon={repeatOutline}/>
                    </ReplaceButtonBox>
                </TradingPriceValueBox>


                <TooltipComponent targetRef={tradingPriceValueElementRef} placement={"bottom"}
                                  toggleBehavior={TooltipToggleBehaviorEnum.OnTargetClick}
                                  tooltipControllerRef={replaceWorkingOrderTooltipControllerRef}>
                    <ReplaceWorkingOrderComponent workingOrder={props.workingOrder} onCloseClick={() => replaceWorkingOrderTooltipControllerRef.current?.close()}/>
                </TooltipComponent>

                <TooltipComponent targetRef={replaceButtonElementRef} placement={"bottom"}
                                  toggleBehavior={TooltipToggleBehaviorEnum.OnTargetMouseEnterLeave}>
                    <ReplaceButtonToolTipContentBox>
                        {services.language.translate('Replace order')}
                    </ReplaceButtonToolTipContentBox>
                </TooltipComponent>


            </PriceContainerBox>
            <PriceContainerBox>
                <div>{services.language.translate('Mid price')}</div>
                <div>{props.workingOrder.midPrice?.toFixed(2)}</div>
            </PriceContainerBox>

        </BodyBox>
    )
});