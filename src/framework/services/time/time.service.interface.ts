import { TimeSpan } from "../../types/time-span";
import {NullableDate, NullableString, NullableUndefinedDate, NullableUndefinedString} from "../../types/nullable-types";
import {MonthModel} from "./month.model";
import {WeekDayModel} from "./week-day.model";
import {TimeOnly} from "../../types/time-only";


export interface GenerateDatesChunksOptions {
    startDate: Date;
    chunksCount: number;
    chunkSize: number;
}

export interface ITimeService {
    readonly currentDate: Date;
    readonly currentTime: TimeOnly;
    parseIsoDate(dateAsString: string): Date;
    tryParseIsoDate(dateAsString: NullableUndefinedString): NullableDate;
    customFormat(date: Date, formatString: string): string;
    formatHHmm(date: NullableUndefinedDate | NullableUndefinedString): string;
    formatHHmmss(date: NullableUndefinedDate | NullableUndefinedString): string;
    formatYYYY_MM_DD(date: NullableDate | NullableString): string;
    formatDD_MM_YYYY(date: NullableDate | NullableString): string;
    formatYYYY_MM_DD_HH_mm_ss(date: Date | string): string
    formatMM_DD_YYYY_withSlash(date: NullableDate | NullableString): string;
    formatDD_MM_YYYY_HH_MM_SS_withSlash(date: NullableDate | NullableString): string;
    tryConvertToDate(date: NullableUndefinedDate | NullableUndefinedString): NullableDate;

    formatUserFriendlyDate(date: NullableUndefinedDate | NullableUndefinedString): string;
    formatUserFriendlyDateAndTime(date: NullableUndefinedDate | NullableUndefinedString): string;
    formatUserFriendlyDayNameDayMonth(date: NullableUndefinedDate | NullableUndefinedString): string;
    formatUserFriendlyMonthDay(date: NullableUndefinedDate | NullableUndefinedString): string

    addDays(toDate: Date | string, days: number): Date;
    addMonths(toDate: Date | string, months: number): Date;
    addYears(toDate: Date | string, years: number): Date;
    addHours(toDate: Date | string, hours: number): Date;
    addMinutes(toDate: Date | string, minutes: number): Date;
    addSeconds(toDate: Date | string, seconds: number): Date;
    addMilliseconds(toDate: Date | string, milliseconds: number): Date;
    addTimeSpan(toDate: Date | string, timeSpan: TimeSpan): Date;
    convertToDate(date: Date | string): Date;
    lastDateOfTheMonth(year: number, month: number): Date;
    getDateRange(startDate: Date | string, endDate: Date | string): Date[];

    /**
     * Converts the date into a date with only year, month and day
     * @param date
     */
    makeShortDate(date: Date | string): Date;
    minDate(range: Date[]): Date;
    maxDate(range: Date[]): Date;
    differenceInHours(dateLeft: Date, dateRight: Date): number;
    differenceInCalendarDays(dateLeft: Date, dateRight: Date): number;
    differenceInCalendarYears(dateLeft: Date, dateRight: Date): number;
    getMonthFullNameFromIndex(monthIndex: number): string;
    getMonthFullNameFromMonthNumber(monthNumber: number): string;
    getMonthAbbreviationFromIndex(monthIndex: number): string;
    getMonthAbbreviationFromMonthNumber(monthNumber: number): string;
    getMonthCalendarWeeks(month: number, year: number): Array<Date[]>;
    getMonthsInRange(from: Date, to: Date): Array<MonthModel>;
    areDatesEqual(date1: NullableUndefinedDate, date2: NullableUndefinedDate): boolean;
    formatYear2Digits(year: number): string;
    generateDatesRange(startingDate: Date, count: number): Date[];
    generateDatesChunks(options: GenerateDatesChunksOptions): Array<Date[]>;
    monthFromDate(date: Date): MonthModel;
    getTimeZoneOffset(): number;
    getWeekDays(): WeekDayModel[];
    getDayOfWeek(id: number): WeekDayModel;
    readonly currentWeekDay: WeekDayModel;
}

