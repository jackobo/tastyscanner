import React, {useRef} from "react";
import {observer} from "mobx-react";
import {TastyScannerStandardPage} from "../tasty-scanner-standard.page";
import {useServices} from "../../hooks/use-services.hook";
import {IWorkingOrderViewModel} from "../../services/brokers/interfaces/working-order.interfaces";
import styled from "styled-components";
import {CardBox} from "../../../framework/components/card/card.box";
import {IonIcon} from "@ionic/react";
import {fishOutline} from "ionicons/icons";
import {TooltipComponent, TooltipToggleBehaviorEnum} from "../../../framework/components/tooltip/tooltip.component";
import {SpinnerComponent} from "../../../framework/components/spinner/spinner.component";

const PageContentBox = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--ion-space-24);
    width: 100%;
    min-height: 100%;
`

const WorkingOrderBox = styled(CardBox)`
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: var(--ion-space-16);
    row-gap: var(--ion-space-8);
    padding: var(--ion-space-24) var(--ion-space-20) var(--ion-space-20) var(--ion-space-20);
`

const GuvidulIndicatorBox = styled.div`
    position: absolute;
    top: 4px;
    left: 8px;
    cursor: pointer;
`

const TooltipContentBox = styled.div`
    padding: var(--ion-space-16);
    font-size: var(--ion-font-size-body2);
`

const NoWorkingOrdersBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    justify-items: center;
    color: var(--ion-color-medium-tint);
    width: 100%;
    flex-grow: 1;
`

const WorkingOrderComponent: React.FC<{workingOrder: IWorkingOrderViewModel}> = observer((props) => {
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

    return (
        <WorkingOrderBox>
            <div>{services.language.translate('Order id:')}</div>
            <div>{props.workingOrder.id}</div>
            <div>{services.language.translate('Trading price:')}</div>
            <div>{props.workingOrder.tradingPrice}</div>
            {renderGuvidulIndicator()}
        </WorkingOrderBox>
    )
})

export const WorkingOrdersPage: React.FC = observer(() => {
    const services = useServices();

    if(services.brokers.accountsLoadingInProgress) {
        return (
            <SpinnerComponent fillContainer={true}/>
        );
    }

    const workingOrders = services.brokers.currentAccount?.workingOrders ?? [];



    const renderOneWorkingOrder = (wo: IWorkingOrderViewModel) => {
        return (<WorkingOrderComponent key={wo.id} workingOrder={wo}/>);
    }

    const renderPageContent = () => {
        if(workingOrders.length === 0) {
            return (
                <NoWorkingOrdersBox>
                    {services.language.translate('No working orders.')}
                </NoWorkingOrdersBox>
            )
        } else {
            return (
                <>
                    {workingOrders.map(renderOneWorkingOrder)}
                </>
            )
        }
    }

    return (
        <TastyScannerStandardPage>
            <PageContentBox>
                {renderPageContent()}
            </PageContentBox>
        </TastyScannerStandardPage>
    )
})