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


export const WokingOrderBodyComponent: React.FC<{workingOrder: IWorkingOrderViewModel;isReadOnly?: boolean;}> = observer((props) => {
    const services = useServices();
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
        <BodyBox>
            <PriceContainerBox>
                <div>{services.language.translate('Trading price')}</div>
                <TradingPriceValueBox ref={tradingPriceValueElementRef} $isReadOnly={Boolean(props.isReadOnly)}>
                    <PriceValueBox>
                        {props.workingOrder.tradingPrice.toString()}
                    </PriceValueBox>

                    {renderReplaceButton()}
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
                <PriceValueBox>
                    {props.workingOrder.midPrice?.toString()}
                </PriceValueBox>
            </PriceContainerBox>

        </BodyBox>
    )
});