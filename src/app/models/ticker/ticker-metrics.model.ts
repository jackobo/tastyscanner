import {ITickerMetricsViewModel} from "./ticker-metrics.view-model.interface";
import {ISymbolMetricsRawData} from "../../services/market-data-provider/market-data-provider.service.interface";
import {NullableDate, NullableNumber} from "../../../framework/types/nullable-types";
import {IAppServiceFactory} from "../../services/app-service-factory.interface";
import {MathUtils} from "../../../framework/utils/math-utils";

export class TickerMetricsModel implements ITickerMetricsViewModel {
    constructor(private readonly metricsRawData: ISymbolMetricsRawData, private readonly services: IAppServiceFactory) {
    }

    public get earningsDate(): NullableDate {
        return this.services.time.tryParseIsoDate(this.metricsRawData.earnings?.expectedReportDate);
    }

    public get daysUntilEarnings(): NullableNumber {
        if(!this.earningsDate) {
            return null;
        }

        return this.services.time.differenceInCalendarDays(this.services.time.currentDate, this.earningsDate);
    }

    public get ivRank(): number {
        return MathUtils.round((this.metricsRawData.impliedVolatilityIndexRank ?? 0) * 100);
    }


    public  get beta(): number {
        return MathUtils.round((this.metricsRawData.beta ?? 0));
    }
}