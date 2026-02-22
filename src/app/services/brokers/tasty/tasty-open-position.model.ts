import {IAccountOpenPositionLegViewModel,
    IAccountOpenPositionViewModel
} from "../interfaces/account-open-position-interface";
import {IAppServiceFactory} from "../../app-service-factory.interface";
import {ITastyAccountOrderRawData} from "./raw-data/tasty-order.raw-data.interfaces";
import {ITastyOpenPositionRawData} from "./raw-data/tasty-open-position.raw-data.interface";

export class TastyOpenPositionModel implements IAccountOpenPositionViewModel {
    constructor(private readonly services: IAppServiceFactory,
                private readonly orderRawData: ITastyAccountOrderRawData,
                private readonly positionLegsRawData: ITastyOpenPositionRawData[]) {
    }

    id: string = "";
    underlyingSymbol: string = "";
    createdAt: Date = new Date();
    tradingPrice: number = 0;
    legs: IAccountOpenPositionLegViewModel[] = [];
}