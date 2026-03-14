import {ITickerMetricsViewModel} from "./ticker-metrics.view-model.interface";
import {ISymbolMetricsRawData} from "../../services/market-data-provider/market-data-provider.service.interface";
import {NullableNumber} from "../../../framework/types/nullable-types";

export class TickerMetricsModel implements ITickerMetricsViewModel {
    constructor(private readonly metricsRawData: ISymbolMetricsRawData) {
    }

    public get earningsDate(): string {
        return this.metricsRawData.earnings?.expectedReportDate ?? "";
    }

    public get daysUntilEarnings(): NullableNumber {
        const earningsDateStr = this.earningsDate;
        if(!earningsDateStr) {
            return null;
        }

        const earningsDate = new Date(earningsDateStr);
        return Math.round((earningsDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    }

    public get ivRank(): number {
        return Math.round((this.metricsRawData.impliedVolatilityIndexRank ?? 0) * 10000) / 100;
    }


    public  get beta(): number {
        return Math.round((this.metricsRawData.beta ?? 0) * 100) / 100;
    }
}