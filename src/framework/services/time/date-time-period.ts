import {NullableDate} from "../../types/nullable-types";

export class DateTimePeriod {
    constructor(startDate: NullableDate, endDate: NullableDate) {
        this.startDate = startDate ?? new Date(0);
        this.endDate = endDate ?? new Date(8640000000000000);
    }

    public readonly startDate: Date;
    public readonly endDate: Date

    intersectsWith(other: DateTimePeriod): boolean {
        const otherStart = other.startDate.getTime();
        const otherEnd = other.endDate.getTime();
        const thisStart = this.startDate.getTime();
        const thisEnd = this.endDate.getTime();

        return (otherStart <= thisStart && thisStart <= otherEnd)
                || (otherStart <= thisEnd && thisEnd <= otherEnd);
    }
}