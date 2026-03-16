import {TastyWorkingOrderModel} from "./tasty-working-order.model";
import {Price} from "../../../../../models/price/price";
import {GobyOrderSource} from "../../../goby-order-source";
import {WorkingOrderAutoReplaceHandlerBaseModel} from "../../../common/working-order-auto-replace-handler-base.model";



export class TastyWorkingOrderAutoReplaceHandlerModel extends WorkingOrderAutoReplaceHandlerBaseModel {
    constructor(private readonly workingOrder: TastyWorkingOrderModel) {
        super(workingOrder.services, workingOrder.gobySource, 'Tasty', workingOrder.accountNumber, workingOrder.id);
    }

    get underlyingSymbol(): string {
        return this.workingOrder.underlyingSymbol;
    }

    get tradingPrice(): Price {
        return this.workingOrder.tradingPrice;
    }

    get isLiveOrder(): boolean {
        //VITE_IGNORE_LIVE_STATUS_FOR_WORKING_ORDER is here to be able to test the logic in development while the market is closed.
        return this.workingOrder.tastyOrderRawData.status === "Live" || import.meta.env.VITE_IGNORE_LIVE_STATUS_FOR_WORKING_ORDER === 'true'
    }


    protected async _executeAutoReplace(newPrice: Price, gobySource: GobyOrderSource): Promise<void> {

        await this.workingOrder.executeAction(this.services.language.translate('Failed to auto replace order!'), async () => {
            await this.workingOrder.replaceOrder(newPrice, gobySource);

        });
    }
}