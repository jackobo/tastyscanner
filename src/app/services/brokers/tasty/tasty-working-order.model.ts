import {IWorkingOrderViewModel} from "../interfaces/working-order.interfaces";
import {ITastyOrderRawData} from "./raw-data/tasty-order.raw-data.interfaces";
import {ORDERS_SOURCE_NAME} from "../constants";
import {TastyAccountModel} from "./tasty-account.model";
import TastyTradeClient from "@tastytrade/api";
import {IAppServiceFactory} from "../../app-service-factory.interface";

export class TastyWorkingOrderModel implements IWorkingOrderViewModel {
    constructor(private readonly tastyOrderRawData: ITastyOrderRawData,
                private readonly tastyClient: TastyTradeClient,
                private readonly services: IAppServiceFactory) {
    }

    get id(): string {
        return this.tastyOrderRawData.id;
    }

    get underlyingSymbol(): string {
        return this.tastyOrderRawData.underlyingSymbol;
    }

    get tradingPrice(): number {
        return parseFloat(this.tastyOrderRawData.price);
    }


    get hasGuvidulSource(): boolean {
        return this.tastyOrderRawData.source === ORDERS_SOURCE_NAME;
    }


    public  async cancelOrder(): Promise<void> {
        try {
            await this.tastyClient.orderService.cancelOrder(this.tastyOrderRawData.accountNumber, parseInt(this.id));
        } catch (err) {
            await this.services.toaster.showErrorToast({
                renderContent: () => this.services.language.translate(`Failed to cancel order! ${err}`)
            });
        }
    }
}