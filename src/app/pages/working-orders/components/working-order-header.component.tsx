import React, {useRef} from "react";
import {IWorkingOrderViewModel} from "../../../services/brokers/interfaces/working-order.interfaces";
import {observer} from "mobx-react";
import {RemoveButtonComponent} from "../../../../framework/components/specialized-buttons/remove-button.component";
import {useServices} from "../../../hooks/use-services.hook";
import styled from "styled-components";
import {IonIcon} from "@ionic/react";
import {fishOutline} from "ionicons/icons";
import {TooltipComponent, TooltipToggleBehaviorEnum} from "../../../../framework/components/tooltip/tooltip.component";

const WorkingOrderHeaderBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: var(--ion-space-8);
`

const UnderlyingSymbolBox = styled.div`
    font-weight: bold;
    font-size: var(--ion-font-size-body1);
`

const WorkingOrderHeaderButtonsBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: var(--ion-space-16);
    flex-grow: 1;
`

const GobyIndicatorBox = styled.div`
    cursor: pointer;
    
`

const GobyTooltipContentBox = styled.div`
    padding: var(--ion-space-16);
    font-size: var(--ion-font-size-body2);
`

const OrderIdBox = styled.div`
    font-size: var(--ion-font-size-body2);
    flex-grow: 1;
    text-align: center;
`

export const WorkingOrderHeaderComponent: React.FC<{workingOrder: IWorkingOrderViewModel}> = observer((props) => {
    const services = useServices();
    const gobyIndicatorRef = useRef<HTMLDivElement | null>(null)
    const cancelClick = async () => {
        await props.workingOrder.cancel();
    }

    const renderGobyIndicator = () => {
        if(props.workingOrder.isGobyOrder) {
            return (
                <>
                    <GobyIndicatorBox ref={gobyIndicatorRef}>
                        <IonIcon icon={fishOutline}/>
                    </GobyIndicatorBox>
                    <OrderIdBox>
                        {`#${props.workingOrder.id}`}
                    </OrderIdBox>
                    <TooltipComponent targetRef={gobyIndicatorRef} placement={"bottom"} toggleBehavior={TooltipToggleBehaviorEnum.OnTargetMouseEnterLeave}>
                        <GobyTooltipContentBox>
                            {services.language.translate('Source: Operation Goby')}
                        </GobyTooltipContentBox>

                    </TooltipComponent>
                </>
            )
        }
        return null;
    }

    return (
        <WorkingOrderHeaderBox>
            <UnderlyingSymbolBox>
                {props.workingOrder.underlyingSymbol}
            </UnderlyingSymbolBox>
            {renderGobyIndicator()}
            <WorkingOrderHeaderButtonsBox>
                <RemoveButtonComponent onClick={cancelClick}
                                       tooltipText={services.language.translate('Cancel order')}/>
            </WorkingOrderHeaderButtonsBox>

        </WorkingOrderHeaderBox>
    );
})