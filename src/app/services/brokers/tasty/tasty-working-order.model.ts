import {IWorkingOrderViewModel} from "../interfaces/working-order.interfaces";
import {ITastyOrderRawData} from "./raw-data/tasty-order.raw-data.interfaces";
import {ORDERS_SOURCE_NAME} from "../constants";

export class TastyWorkingOrderModel implements IWorkingOrderViewModel {
    constructor(private readonly tastyOrderRawData: ITastyOrderRawData) {
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
}