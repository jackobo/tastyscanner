import {TickerInfoViewModel} from "./ticker-info.view-model.interface";
import {ISymbolInfoRawData} from "../../services/market-data-provider/market-data-provider.service.interface";

export class TickerInfoModel implements TickerInfoViewModel {
    constructor(private readonly symbolRawInfo: ISymbolInfoRawData) {
    }
    public get description(): string {
        return this.symbolRawInfo.description;
    }

    public  get listedMarket(): string {
        return this.symbolRawInfo.listedMarket;
    }
}