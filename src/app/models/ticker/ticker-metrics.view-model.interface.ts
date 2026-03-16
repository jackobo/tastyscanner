import {NullableDate, NullableNumber} from "../../../framework/types/nullable-types";

export interface ITickerMetricsViewModel {
    readonly ivRank: number;
    readonly beta: number;
    readonly earningsDate: NullableDate;
    readonly daysUntilEarnings: NullableNumber;
}