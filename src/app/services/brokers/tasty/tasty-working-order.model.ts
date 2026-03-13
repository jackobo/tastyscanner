import {IWorkingOrderViewModel} from "../interfaces/working-order.interfaces";
import {ITastyOrderRawData} from "./raw-data/tasty-order.raw-data.interfaces";

export class TastyWorkingOrderModel implements IWorkingOrderViewModel {
    constructor(private readonly tastyOrderRawData: ITastyOrderRawData) {
    }

    get id(): string {
        return this.tastyOrderRawData.id;
    }
    get tradingPrice(): number {
        return parseFloat(this.tastyOrderRawData.price);
    }
}