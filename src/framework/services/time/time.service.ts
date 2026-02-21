import {GenerateDatesChunksOptions, ITimeService} from "./time.service.interface";
import {
    format,
    addDays,
    addYears,
    addHours,
    addMinutes,
    addSeconds,
    addMilliseconds,
    addMonths,
    eachDayOfInterval,
    max,
    min,
    differenceInCalendarDays,
    differenceInCalendarYears,
    lastDayOfMonth,
    eachWeekOfInterval,
    Locale,
    parseISO as dateFnsParseIso,
    differenceInHours, Day,

} from "date-fns";

//import {formatInTimeZone} from 'date-fns-tz'
import { TimeSpan } from "../../types/time-span";
import {NullableDate, NullableString, NullableUndefinedDate, NullableUndefinedString} from "../../types/nullable-types";
import {MonthModel} from "./month.model";
import {Check} from "../../utils/type-checking";
import {Month} from "date-fns/types";
import {WeekDayModel} from "./week-day.model";
import {TimeOnly} from "../../types/time-only";
import {Lazy} from "../../utils/lazy";
import {FrameworkServiceBase} from "../framework-service-base";

export class TimeService extends FrameworkServiceBase implements ITimeService {
    get currentDate(): Date {
        return new Date();
    }

    get currentTime(): TimeOnly {
        const d = this.currentDate;
        return new TimeOnly(d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds(), false);
    }

    parseIsoDate(dateAsString: string): Date {
        const d = dateFnsParseIso(dateAsString);
        if(!Check.isDate(d)) {
            throw new Error(`Failed to parse date ${dateAsString}`);
        }

        return d;
    }

    tryParseIsoDate(dateAsString: NullableUndefinedString): NullableDate {
        if(!dateAsString) {
            return null;
        }

        return this.parseIsoDate(dateAsString);
    }

    convertToDate(date: Date | string): Date {
        if (Check.isString(date)) {
            return this.parseIsoDate(date);
        } else {
            return date;
        }
    }

    tryConvertToDate(date: NullableUndefinedDate | NullableUndefinedString): NullableDate {
        if (!date) {
            return null;
        }

        try {
            return this.convertToDate(date);
        } catch (err) {
            this.services.logger.error(`Failed to parse date ${date}`, err);
            return null;
        }

    }


    customFormat(date: Date, formatString: string): string {
        return format(date, formatString);
    }


    formatHHmm(date: NullableUndefinedDate | NullableUndefinedString): string {
        if (!date) {
            return '';
        }
        return format(this.convertToDate(date), 'HH:mm', {
            locale: this.services.language.currentLocale
        });
    }

    formatHHmmss(date: NullableUndefinedDate | NullableUndefinedString): string {
        if (!date) {
            return '';
        }
        return format(this.convertToDate(date), 'HH:mm:ss', {
            locale: this.services.language.currentLocale
        });
    }

    formatYYYY_MM_DD(date: NullableDate | NullableString): string {
        if (!date) {
            return "";
        }
        return format(this.convertToDate(date), 'yyyy-MM-dd');
    }

    formatDD_MM_YYYY(date: NullableDate | NullableString): string {
        if (!date) {
            return "";
        }
        return format(this.convertToDate(date), 'dd-MM-yyyy');
    }

    formatMM_DD_YYYY_withSlash(date: NullableDate | NullableString): string {
        if (!date) {
            return "";
        }
        return format(this.convertToDate(date), 'MM/dd/yyyy');
    }

    formatDD_MM_YYYY_HH_MM_SS_withSlash(date: NullableDate | NullableString): string {
        if (!date) {
            return "";
        }
        return format(this.convertToDate(date), 'dd/MM/yyyy HH:mm:ss');
    }

    formatYYYY_MM_DD_HH_mm_ss(date: Date | string): string {
        if (!date) {
            return "";
        }
        return format(this.convertToDate(date), 'yyyy-MM-dd HH:mm:ss');
    }

    formatUserFriendlyDate(date: NullableUndefinedDate | NullableUndefinedString): string {
        if(!date) {
            return "";
        }

        return format(this.convertToDate(date), 'PP', {
            locale: this.services.language.currentLocale
        });
    }

    formatUserFriendlyDateAndTime(date: NullableUndefinedDate | NullableUndefinedString): string {
        if(!date) {
            return "";
        }

        return format(this.convertToDate(date), 'd MMMM yyyy HH:mm', {
            locale: this.services.language.currentLocale
        });
    }


    formatUserFriendlyDayNameDayMonth(date: NullableUndefinedDate | NullableUndefinedString): string {
        if(!date) {
            return "";
        }

        return format(this.convertToDate(date), 'EEE dd MMM', {
            locale: this.services.language.currentLocale
        });
    }

    formatUserFriendlyMonthDay(date: NullableUndefinedDate | NullableUndefinedString): string {
        if(!date) {
            return "";
        }

        return format(this.convertToDate(date), 'MMM d', {
            locale: this.services.language.currentLocale
        });
    }

    addDays(toDate: Date | string, days: number): Date {
        return addDays(this.convertToDate(toDate), days);
    }

    addMonths(toDate: Date | string, months: number): Date {
        return addMonths(this.convertToDate(toDate), months);
    }

    addYears(toDate: Date | string, years: number): Date {
        return addYears(this.convertToDate(toDate), years);
    }

    addHours(toDate: Date | string, hours: number): Date {
        return addHours(this.convertToDate(toDate), hours);
    }

    addMinutes(toDate: Date | string, minutes: number): Date {
        return addMinutes(this.convertToDate(toDate), minutes);
    }
    addSeconds(toDate: Date | string, seconds: number): Date {
        return addSeconds(this.convertToDate(toDate), seconds);
    }
    addMilliseconds(toDate: Date | string, milliseconds: number): Date {
        return addMilliseconds(this.convertToDate(toDate), milliseconds);
    }
    addTimeSpan(toDate: Date | string, timeSpan: TimeSpan): Date {
        return addMilliseconds(this.convertToDate(toDate), timeSpan.totalMilliseconds);
    }


    /**
     * Return the last date of the month
     * @param year
     * @param month is 1 based
     */
    lastDateOfTheMonth(year: number, month: number): Date {
        return addDays(addMonths(new Date(year, month - 1, 1), 1), -1);
    }

    getDateRange(startDate: Date | string, endDate: Date | string): Date[] {
        return eachDayOfInterval({
            start: this.convertToDate(startDate),
            end: this.convertToDate(endDate)
        })
    }

    makeShortDate(date: Date | string): Date {
        return this.parseIsoDate(this.formatYYYY_MM_DD(date));
    }

    minDate(range: Date[]): Date {
        return min(range);
    }

    maxDate(range: Date[]): Date {
        return max(range);
    }

    differenceInHours(dateLeft: Date, dateRight: Date): number {
        return differenceInHours(dateRight, dateLeft);
    }
    
    differenceInCalendarDays(dateLeft: Date, dateRight: Date): number {
        return differenceInCalendarDays(dateRight, dateLeft);
    }

    differenceInCalendarYears(dateLeft: Date, dateRight: Date): number {
        return differenceInCalendarYears(dateRight, dateLeft);
    }

    get locale(): Locale {
        return this.services.language.currentLocale;
    }

    getMonthFullNameFromIndex(monthIndex: number): string {
        return this.locale.localize?.month(monthIndex as Month)
                || ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][monthIndex];
    }

    getMonthFullNameFromMonthNumber(monthNumber: number): string {
        return this.getMonthFullNameFromIndex((monthNumber - 1) as Month);
    }

    getMonthAbbreviationFromIndex(monthIndex: number): string {
        return this.locale.localize?.month(monthIndex as Month, {
                width: 'abbreviated'
            })
            || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthIndex];
    }

    getMonthAbbreviationFromMonthNumber(monthNumber: number): string {
        return this.getMonthAbbreviationFromIndex(monthNumber - 1);
    }

    private _getDayNameNarrow(day: number): string {
        return this.locale.localize?.day(day as Day, {width: 'narrow'})
            || ['S', 'M', 'T', 'W', 'T', 'F', 'S'][day];
    }


    private _getDayNameAbbreviation(day: number): string {
        return this.locale.localize?.day(day as Day, {width: 'abbreviated'})
            || ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day];
    }

    private _getDayFullName(day: number): string {
        return this.locale.localize?.day(day as Day)
            || ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day];
    }

    private _getWeekDaysOrder(): number[] {
        const orderedWeekDays: number[] = [];
        for(let i = this.firstDayOfTheWeek; i <=6; i++) {
            orderedWeekDays.push(i);
        }

        for(let i = 0; i < this.firstDayOfTheWeek; i++) {
            orderedWeekDays.push(i);
        }

        return orderedWeekDays;

    }

    get firstDayOfTheWeek(): number {
        return this.locale.options?.weekStartsOn || 1;
    }

    generateDatesChunks(options: GenerateDatesChunksOptions): Array<Date[]> {
        const chunks:  Array<Date[]> = [];
        let startDate = options.startDate;
        for(let i = 1; i <= options.chunksCount; i++) {
            const chunk = this.generateDatesRange(startDate, options.chunkSize);
            chunks.push(chunk);
            startDate = this.addDays(chunk[chunk.length - 1], 1);
        }

        return chunks;
    }

    generateDatesRange(startingDate: Date, count: number): Date[] {
        const dates: Date[] = [];
        for(let i = 1; i <= count; i++) {
            dates.push(this.addDays(startingDate, i));
        }
        return dates;
    }

    getMonthCalendarWeeks(month: number, year: number): Array<Date[]> {
        const weeks: Array<Date[]> = [];
        const firstDateOfTheMonth = new Date(year, month, 1);
        const lastDateOfTheMonth = lastDayOfMonth(firstDateOfTheMonth);
        const weeksStartingDates = eachWeekOfInterval({
            start: firstDateOfTheMonth,
            end: lastDateOfTheMonth
        }, {
            locale: this.locale
        });

        for(const weekFirstDate of weeksStartingDates) {
            const week: Date[] = [];
            const weekLastDate = addDays(weekFirstDate, 6);
            for(let d = weekFirstDate; d <= weekLastDate; d = addDays(d, 1)) {
                week.push(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
            }

            weeks.push(week);
        }

        return weeks;
    }

    getMonthsInRange(from: Date, to: Date): Array<MonthModel> {
        const result: Array<MonthModel> = [];
        for(let d = new Date(from.getFullYear(), from.getMonth(), 1); d <= to; d = addMonths(d, 1)) {
            result.push(new MonthModel(d.getMonth(), d.getFullYear(), this));
        }
        return result;
    }

    monthFromDate(date: Date): MonthModel {
        return new MonthModel(date.getMonth(), date.getFullYear(), this);
    }


    areDatesEqual(date1: NullableUndefinedDate, date2: NullableUndefinedDate): boolean {
        return date1?.getTime() === date2?.getTime();
    }

    formatYear2Digits(year: number): string {
        return format(new Date(year, 1, 1), 'yy');
    }

    getTimeZoneOffset(): number {
        return this.currentDate.getTimezoneOffset();
    }

    private _weekDaysMap: Lazy<Record<number, WeekDayModel>> = new Lazy<Record<number, WeekDayModel>>(() => {

        const result: Record<number, WeekDayModel> = {};
        for(const d of this._getWeekDaysOrder()) {
            result[d] = new WeekDayModel(d, this._getDayFullName(d), this._getDayNameAbbreviation(d), this. _getDayNameNarrow(d));
        }

        return result;
    })

    private _weekDaysList: Lazy<WeekDayModel[]> = new Lazy<WeekDayModel[]>(() => {
        return this._getWeekDaysOrder().map(dayOfWeek => this._weekDaysMap.value[dayOfWeek]);
    });

    getWeekDays(): WeekDayModel[] {
        return this._weekDaysList.value;
    }

    getDayOfWeek(id: number): WeekDayModel {
        return this._weekDaysMap.value[id];
    }

    get currentWeekDay(): WeekDayModel {
        return this.getDayOfWeek(this.currentDate.getDay());
    }
}
