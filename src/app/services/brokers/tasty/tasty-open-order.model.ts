import {IAccountOpenOrderLegViewModel,
    IAccountOpenOrderViewModel
} from "../interfaces/account-open-order-interface";
import {IAppServiceFactory} from "../../app-service-factory.interface";
import {
    ITastyLegConsolidatedWithPosition,
    ITastyOrderConsolidatedWithPositions
} from "./raw-data/tasty-order-consoliddate-with-positions.raw-data.interface";
import {isSellToOpenAction} from "../interfaces/open-order-request.interface";

export class TastyOpenOrderModel implements IAccountOpenOrderViewModel {
    constructor(private readonly services: IAppServiceFactory,
                private readonly orderRawData: ITastyOrderConsolidatedWithPositions) {
    }

    id: string = "";
    underlyingSymbol: string = "";
    createdAt: Date = new Date();
    tradingPrice: number = 0;
    legs: IAccountOpenOrderLegViewModel[] = [];
}

export class TastyOpenOrderLegModel implements IAccountOpenOrderLegViewModel {
    constructor(private readonly services: IAppServiceFactory,
                private readonly legRawData: ITastyLegConsolidatedWithPosition) {
    }

    get symbol(): string {
        return this.legRawData.leg.symbol;
    }
    get quantity(): number {
        return this.legRawData.leg.quantity;
    }

    get instrumentType(): string {
        return this.legRawData.leg.instrumentType;
    }
    get price(): number {
        const fillsTotal = this.legRawData.leg.fills.sum(fill => parseFloat(fill.fillPrice))
        if(isSellToOpenAction(this.legRawData.leg.action)) {
            return fillsTotal;
        }
        return -1 * fillsTotal;
    }
    get isSell(): boolean {
        return isSellToOpenAction(this.legRawData.leg.action);
    }
    get optionType(): "P" | "C" | undefined {
        return undefined;
    }
}
