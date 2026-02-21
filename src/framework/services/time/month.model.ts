import {ITimeService} from "./time.service.interface";
import {lastDayOfMonth} from "date-fns";

export class MonthModel {

    /**
     *
     * @param month - is the javascript month number which is 0 based index
     * @param year
     * @param time
     */
    constructor(public readonly month: number, public readonly year: number, private readonly time: ITimeService) {
    }

    get key(): string {
        return `${this.year}_${this.month}`;
    }

    get isCurrentMonth(): boolean {
        return this.month === this.time.currentDate.getMonth() && this.year === this.time.currentDate.getFullYear();
    }

    get isInCurrentYear(): boolean {
        return this.time.currentDate.getFullYear() === this.year;
    }

    get firstDate(): Date {
        return new Date(this.year, this.month, 1);
    }

    get lastDate(): Date {
        return lastDayOfMonth(this.firstDate);
    }

    get nextMonth(): MonthModel {
        const firstDayOfNextMonth = this.time.addDays(this.lastDate, 1);

        return new MonthModel(firstDayOfNextMonth.getMonth(), firstDayOfNextMonth.getFullYear(), this.time);
    }

    containsDate(date: Date): boolean {
        return this.firstDate.getTime() <= date.getTime()
                && date.getTime() <= this.lastDate.getTime();
    }

    getAllDates(): Date[] {
        return this.time.getDateRange(this.firstDate, this.lastDate);
    }

    get abbreviatedName(): string {
        return this.time.getMonthAbbreviationFromIndex(this.month)
    }

    get fullName(): string {
        return this.time.getMonthFullNameFromIndex(this.month)
    }
}
