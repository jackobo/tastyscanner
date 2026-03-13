import React, {useRef} from "react";
import {observer} from "mobx-react";
import {IWorkingOrderViewModel} from "../../../services/brokers/interfaces/working-order.interfaces";
import {useServices} from "../../../hooks/use-services.hook";
import {IonIcon} from "@ionic/react";
import {fishOutline} from "ionicons/icons";
import {TooltipComponent, TooltipToggleBehaviorEnum} from "../../../../framework/components/tooltip/tooltip.component";
import styled from "styled-components";
import {RemoveButtonComponent} from "../../../../framework/components/specialized-buttons/remove-button.component";
import {CardBox} from "../../../../framework/components/card/card.box";

const WorkingOrderBox = styled(CardBox)`
    display: flex;
    flex-direction: column;
    gap: var(--ion-space-8);
`


const WorkingOrderFieldsBox = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: var(--ion-space-16);
    row-gap: var(--ion-space-8);
    
`

const WorkingOrderHeaderBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: var(--ion-space-16);
`
const WorkingOrderHeaderButtonsBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: var(--ion-space-16);
    flex-grow: 1;
`


const GuvidulIndicatorBox = styled.div`
    cursor: pointer;
`

const TooltipContentBox = styled.div`
    padding: var(--ion-space-16);
    font-size: var(--ion-font-size-body2);
`

export const WorkingOrderComponent: React.FC<{workingOrder: IWorkingOrderViewModel}> = observer((props) => {
    const services = useServices();
    const guvidulIndicatorRef = useRef<HTMLDivElement | null>(null)

    const renderGuvidulIndicator = () => {
        if(props.workingOrder.hasGuvidulSource) {
            return (
                <>
                    <GuvidulIndicatorBox ref={guvidulIndicatorRef}>
                        <IonIcon icon={fishOutline}/>
                    </GuvidulIndicatorBox>
                    <TooltipComponent targetRef={guvidulIndicatorRef} placement={"bottom"} toggleBehavior={TooltipToggleBehaviorEnum.OnTargetMouseEnterLeave}>
                        <TooltipContentBox>
                            Source: Operatiunea Guvidul
                        </TooltipContentBox>

                    </TooltipComponent>
                </>
            )
        }
        return null;
    }

    const cancelClick = async () => {
        await props.workingOrder.cancelOrder();
    }

    return (
        <WorkingOrderBox>
            <WorkingOrderHeaderBox>
                {renderGuvidulIndicator()}
                <WorkingOrderHeaderButtonsBox>
                    <RemoveButtonComponent onClick={cancelClick}
                                           tooltipText={services.language.translate('Cancel order')}/>
                </WorkingOrderHeaderButtonsBox>

            </WorkingOrderHeaderBox>

            <WorkingOrderFieldsBox>
                <div>{services.language.translate('Order id:')}</div>
                <div>{props.workingOrder.id}</div>
                <div>{services.language.translate('Underlying symbol:')}</div>
                <div>{props.workingOrder.underlyingSymbol}</div>
                <div>{services.language.translate('Trading price:')}</div>
                <div>{props.workingOrder.tradingPrice}</div>
            </WorkingOrderFieldsBox>

        </WorkingOrderBox>
    )
})