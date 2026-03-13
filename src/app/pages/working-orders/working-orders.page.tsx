import React from "react";
import {observer} from "mobx-react";
import {TastyScannerStandardPage} from "../tasty-scanner-standard.page";
import {useServices} from "../../hooks/use-services.hook";
import {IWorkingOrderViewModel} from "../../services/brokers/interfaces/working-order.interfaces";
import styled from "styled-components";
import {SpinnerComponent} from "../../../framework/components/spinner/spinner.component";
import {WorkingOrderComponent} from "./components/working-order.component";


const PageContentBox = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100%;
`

const WorkingOrdersContainerBox = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--ion-space-24);
    width: 100%;
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
                <WorkingOrdersContainerBox>
                    {workingOrders.map(renderOneWorkingOrder)}
                </WorkingOrdersContainerBox>
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