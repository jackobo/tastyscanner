import React, {useRef} from "react";
import {IWorkingOrderViewModel} from "../../../services/brokers/interfaces/working-order.interfaces";
import {observer} from "mobx-react";
import {RemoveButtonComponent} from "../../../../framework/components/specialized-buttons/remove-button.component";
import {useServices} from "../../../hooks/use-services.hook";
import styled from "styled-components";
import {IonIcon} from "@ionic/react";
import {fishOutline} from "ionicons/icons";
import {TooltipComponent, TooltipToggleBehaviorEnum} from "../../../../framework/components/tooltip/tooltip.component";
import {TooltipStandardContentBox} from "../../../../framework/components/tooltip/tooltip-standard-content.box";

const WorkingOrderHeaderBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: var(--ion-space-8);
    padding-bottom: 4px;
    border-bottom: 1px solid var(--ion-color-border);
    width: 100%;
`

const UnderlyingSymbolBox = styled.div`
    font-weight: bold;
`

const WorkingOrderHeaderButtonsBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`

const GobyIndicatorBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    font-size: 1.1rem;
    
`


const OrderIdBox = styled.div<{$isReadOnly: boolean}>`
    flex-grow: 1;
    text-align: ${props => props.$isReadOnly ? 'right' : 'center'};
`

export const WorkingOrderHeaderComponent: React.FC<{workingOrder: IWorkingOrderViewModel; isReadOnly?: boolean;}> = observer((props) => {
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

                    <TooltipComponent targetRef={gobyIndicatorRef}
                                      toggleBehavior={TooltipToggleBehaviorEnum.OnTargetMouseEnterLeave}>
                        <TooltipStandardContentBox>
                            {services.language.translate('Source: Operation Goby')}
                        </TooltipStandardContentBox>

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
            <OrderIdBox $isReadOnly={Boolean(props.isReadOnly)}>
                {`#${props.workingOrder.id}`}
            </OrderIdBox>
            <WorkingOrderHeaderButtonsBox>
                {!props.isReadOnly && <RemoveButtonComponent onClick={cancelClick} tooltipText={services.language.translate('Cancel order')} />}
            </WorkingOrderHeaderButtonsBox>

        </WorkingOrderHeaderBox>
    );
})