import {IWorkingOrderLegViewModel} from "../../../interfaces/working-order.interfaces";
import {ITastyOrderLegRawData} from "../../raw-data/tasty-order.raw-data.interfaces";
import {IAppServiceFactory} from "../../../../app-service-factory.interface";
import {isBuyAction, isSellAction} from "../../../interfaces/open-order-request.interface";
import {IOptionViewModel} from "../../../../../models/option.view-model.interface";
import {computed, makeObservable} from "mobx";

export class TastyWorkingOrderLegModel implements IWorkingOrderLegViewModel {
    constructor(private readonly legRawData: ITastyOrderLegRawData,
                private readonly underlyingSymbol: string,
                private readonly services: IAppServiceFactory) {
        makeObservable(this, {
            option: computed
        });
    }

    get key(): string {
        return this.legRawData.symbol;
    }

    get isBuy(): boolean {
        return isBuyAction(this.legRawData.action);
    }
    get isSell(): boolean {
        return isSellAction(this.legRawData.action);
    }

    get quantity(): number {
        return this.legRawData.quantity;
    }

    get option(): IOptionViewModel | null {

        if(this.legRawData.instrumentType === "Equity Option") {
            this.services.tickers.getTicker(this.underlyingSymbol).getOptionBySymbol(this.legRawData.symbol);
        }
        return null;
    }
}