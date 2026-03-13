import {IWorkingOrderViewModel} from "../interfaces/working-order.interfaces";
import {ITastyOrderRawData} from "./raw-data/tasty-order.raw-data.interfaces";
import {ORDERS_SOURCE_NAME} from "../constants";
import {TastyAccountModel} from "./tasty-account.model";

export class TastyWorkingOrderModel implements IWorkingOrderViewModel {
    constructor(private readonly tastyOrderRawData: ITastyOrderRawData,
                private readonly account: TastyAccountModel) {
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
        await this.account.cancelOrder(this.id);
    }
}