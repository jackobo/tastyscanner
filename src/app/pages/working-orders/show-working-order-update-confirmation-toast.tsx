import {IWorkingOrderViewModel} from "../../services/brokers/interfaces/working-order.interfaces";
import {IAppServiceFactory} from "../../services/app-service-factory.interface";
import {TimeSpan} from "../../../framework/types/time-span";
import {
    OrderUpdateType,
    WorkingOrderConfirmationToastComponent
} from "./components/working-order-confirmation-toast.component";


export async function showWorkingOrderUpdateConfirmationToast(orderUpdateType: OrderUpdateType,
                                                              workingOrder: IWorkingOrderViewModel,
                                                              services: IAppServiceFactory): Promise<void> {

    const renderContent = () => <WorkingOrderConfirmationToastComponent orderUpdateType={orderUpdateType} workingOrder={workingOrder}/>
    const autoCloseTime = TimeSpan.fromSeconds(3);
    await services.toaster.showToast({
        renderContent: renderContent,
        autoCloseTime: autoCloseTime
    });

}