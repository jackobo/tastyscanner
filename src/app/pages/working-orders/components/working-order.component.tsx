import React, {useRef} from "react";
import {observer} from "mobx-react";
import {IWorkingOrderViewModel} from "../../../services/brokers/interfaces/working-order.interfaces";
import {useServices} from "../../../hooks/use-services.hook";
import styled from "styled-components";
import {CardBox} from "../../../../framework/components/card/card.box";
import {WorkingOrderHeaderComponent} from "./working-order-header.component";
import {IonIcon} from "@ionic/react";
import {repeatOutline} from "ionicons/icons";
import {TooltipComponent, TooltipToggleBehaviorEnum} from "../../../../framework/components/tooltip/tooltip.component";
import {WorkingOrderLegsComponent} from "./working-order-legs.component";

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

const PriceBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: var(--ion-space-8);
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


export const WorkingOrderComponent: React.FC<{workingOrder: IWorkingOrderViewModel}> = observer((props) => {
    const services = useServices();
    const tradingPriceValueRef = useRef<HTMLDivElement | null>(null);


    return (
        <WorkingOrderBox>

            <WorkingOrderHeaderComponent workingOrder={props.workingOrder}/>
            <WorkingOrderFieldsBox>
                <PriceBox>
                    <div>{services.language.translate('Trading price')}</div>
                    <TradingPriceValueBox ref={tradingPriceValueRef}>
                        <div>{props.workingOrder.tradingPrice.toFixed(2)}</div>
                        <ReplaceButtonBox>
                            <IonIcon icon={repeatOutline}/>
                        </ReplaceButtonBox>
                    </TradingPriceValueBox>

                    <TooltipComponent targetRef={tradingPriceValueRef} placement={"bottom"} toggleBehavior={TooltipToggleBehaviorEnum.OnTargetClick}>
                        <div>
                            Replace content here
                        </div>
                    </TooltipComponent>


                </PriceBox>
                <PriceBox>
                    <div>{services.language.translate('Mid price')}</div>
                    <div>{props.workingOrder.midPrice?.toFixed(2)}</div>
                </PriceBox>

            </WorkingOrderFieldsBox>
            <WorkingOrderLegsComponent workingOrder={props.workingOrder}/>
        </WorkingOrderBox>
    )
})