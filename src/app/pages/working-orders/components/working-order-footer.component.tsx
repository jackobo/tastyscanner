import React from "react";
import {IWorkingOrderViewModel} from "../../../services/brokers/interfaces/working-order.interfaces";
import {observer} from "mobx-react";

export const WokingOrderFooterComponent: React.FC<{workingOrder: IWorkingOrderViewModel}> = observer((props) => {
    return (
        <div>
            Footer
        </div>
    )
})