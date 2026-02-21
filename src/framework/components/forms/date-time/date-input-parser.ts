import {NullableDate, NullableNumber, NullableString, NullableUndefinedDate} from "../../../types/nullable-types";
import type {MaskPart, Replacement} from "@react-input/mask/types";
import {format, formatToParts} from "@react-input/mask";
import {Check} from "../../../utils/type-checking";
import {IFrameworkServiceFactory} from "../../../services/framework-service-factory.interface";



interface DateParseResult {
    value: NullableDate;
    formattedValue: NullableString;
    error: NullableString;
}

const DateParseNullResult: DateParseResult = {
    value: null,
    formattedValue: null,
    error: null
}

interface DateInputParserOptions {
    mask: string;
    replacement: Replacement;
    minDate: NullableUndefinedDate;
    maxDate: NullableUndefinedDate
}

export class DateInputParser {
    constructor(private readonly services: IFrameworkServiceFactory,
                private readonly options: DateInputParserOptions)
    {
    }

    formatValue(date: Date): string {
        return format(this._formatDateAsMaskedString(date), {
            mask: this.options.mask,
            replacement: this.options.replacement
        });

    }

    parseValue(value: string): DateParseResult {
        if(Check.isEmpty(value)) {
            return DateParseNullResult;
        }


        const maskParts = this._formatToMaskParts(value);
        if(maskParts.length === 0) {
            return DateParseNullResult;
        }

        const parts = [
            this._getYear(maskParts),
            this._getMonth(maskParts),
            this._getDay(maskParts),
            this._getHour(maskParts) ?? 0,
            this._getMinute(maskParts) ?? 0,
            this._getSeconds(maskParts) ?? 0,

        ];

        if(parts.all(p => Check.isNullOrUndefined(p))) {
            return DateParseNullResult;
        }

        if(parts.some(p => Check.isNullOrUndefined(p))) {
            return {
                value: null,
                formattedValue: value,
                error: this.services.language.translate('Invalid date value.')
            };
        }

        const nonNullParts: number[] = parts.map(p => p ?? 0);

        let error = this._validateParts(nonNullParts);
        if(error) {
            return {
                value: null,
                formattedValue: value,
                error: error
            };
        }

        const date = new Date(nonNullParts[0], nonNullParts[1] - 1, nonNullParts[2], nonNullParts[3], nonNullParts[4], nonNullParts[5], 0);

        error = this._validateDate(date);
        if(error) {
            return {
                value: null,
                formattedValue: value,
                error: error
            };
        }

        return {
            value: date,
            formattedValue: this.formatValue(date),
            error: null
        };
    }

    private _validateParts(parts: number[]): NullableString {
        const year = parts[0];
        if(year < 1000 || year > 9999) {
            return this.services.language.translate('Invalid year value.');
        }

        const month = parts[1];
        if(month < 1 || month > 12) {
            return this.services.language.translate('Month must be between 01 and 12.');
        }

        const day = parts[2];
        const time = this.services.time;
        const firstDateOfTheMonth = new Date(year, month - 1, 1);
        const lastDayInMonth = time.addDays(time.addMonths(firstDateOfTheMonth, 1), -1).getDate();


        if(day < 1 || day > lastDayInMonth) {
            return this.services.language.translationFor('Day must be between 01 and {maxDay}.').withParams({
                maxDay: lastDayInMonth
            });
        }

        const hour = parts[3];
        if(hour < 0 || hour > 23) {
            return this.services.language.translate('Hour must be between 00 and 23.');
        }

        const minute = parts[4];
        if(minute < 0 || minute > 59) {
            return this.services.language.translate('Minute must be between 00 and 59.');
        }

        const seconds = parts[5];
        if(seconds < 0 || seconds > 59) {
            return this.services.language.translate('Second must be between 00 and 59.');
        }

        return null;
    }

    private _validateDate(date: Date): NullableString {
        if(this.options.minDate && date.getTime() < this.options.minDate.getTime()) {
            return this.services.language.translationFor('Minimum date can be {minDate}').withParams({
                minDate: this.formatValue(this.options.minDate)
            });
        }

        if(this.options.maxDate && date.getTime() > this.options.maxDate.getTime()) {
            return this.services.language.translationFor('Maximum date can be {maxDate}').withParams({
                maxDate: this.formatValue(this.options.maxDate)
            });
        }

        return null;
    }
    private _formatToMaskParts(value: string): MaskPart[] {
        return formatToParts(value, {
            mask: this.options.mask,
            replacement: this.options.replacement,
        });
    }

    private _getYear(maskParts: MaskPart[]): NullableNumber {
        return this._extractDatePartFromMask(maskParts.slice(6, 10));
    }

    private _getMonth(maskParts: MaskPart[]): NullableNumber {
        return this._extractDatePartFromMask(maskParts.slice(3, 5));
    }

    private _getDay(maskParts: MaskPart[]): NullableNumber {
        return this._extractDatePartFromMask(maskParts.slice(0, 2));
    }

    private _getHour(maskParts: MaskPart[]): NullableNumber {
        return this._extractDatePartFromMask(maskParts.slice(11, 13), true);
    }

    private _getMinute(maskParts: MaskPart[]): NullableNumber {
        return this._extractDatePartFromMask(maskParts.slice(14, 16), true);
    }

    private _getSeconds(maskParts: MaskPart[]): NullableNumber {
        return this._extractDatePartFromMask(maskParts.slice(17, 19), true);
    }

    private _extractDatePartFromMask(maskParts: MaskPart[], allowIncompletePart: boolean = false): NullableNumber {

        if(maskParts.length === 0) {
            return null;
        }

        const validParts = maskParts.filter(p => p.type === "input")
            .map(p => p.value);


        if(validParts.length === 0) {
            return null;
        }


        if(!allowIncompletePart && validParts.length !== maskParts.length) {
            return null;
        }

        const value = parseInt(validParts.join(''));
        if(Check.isNumber(value)) {
            return value;
        }

        return null;
    }

    private _formatDateAsMaskedString(date: Date): string {
        const dateParts = [
            this._padDatePart(date.getDate()),
            this._padDatePart(date.getMonth() + 1),
            date.getFullYear().toString()
        ];

        const timeParts: string[] = [
            this._padDatePart(date.getHours()),
            this._padDatePart(date.getMinutes()),
            this._padDatePart(date.getSeconds())
        ];

        return dateParts.join('/') + ' ' + timeParts.join(':');
    }

    private _padDatePart(part: number): string {
        return part.toString().padStart(2, '0');
    }

}