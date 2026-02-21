import { NullableNumber, NullableString} from "../../../types/nullable-types";
import type {MaskPart, Replacement} from "@react-input/mask/types";
import {format, formatToParts} from "@react-input/mask";
import {Check} from "../../../utils/type-checking";
import {NullableTimeOnly, TimeOnly} from "../../../types/time-only";
import {IFrameworkServiceFactory} from "../../../services/framework-service-factory.interface";



interface TimeParseResult {
    value: NullableTimeOnly;
    formattedValue: NullableString;
    error: NullableString;
}

const TimeParseNullResult: TimeParseResult = {
    value: null,
    formattedValue: null,
    error: null
}

interface TimeInputParserOptions {
    mask: string;
    replacement: Replacement;
    isUtc: boolean;
}

export class TimeOnlyInputParser {
    constructor(private readonly services: IFrameworkServiceFactory,
                private readonly options: TimeInputParserOptions)
    {
    }

    formatValue(time: TimeOnly): string {
        return format(this._formatTimeMaskedString(time), {
            mask: this.options.mask,
            replacement: this.options.replacement
        });

    }

    parseValue(value: string): TimeParseResult {
        if(Check.isEmpty(value)) {
            return TimeParseNullResult;
        }

        const maskParts = this._formatToMaskParts(value);
        if(maskParts.length === 0) {
            return TimeParseNullResult;
        }

        const parts = [
            this._getHour(maskParts) ?? 0,
            this._getMinute(maskParts) ?? 0,
            this._getSeconds(maskParts) ?? 0,
        ];

        if(parts.all(p => Check.isNullOrUndefined(p))) {
            return TimeParseNullResult;
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

        const time = new TimeOnly(nonNullParts[0], nonNullParts[1], nonNullParts[2], 0, this.options.isUtc);

        error = this._validateTime(time);
        if(error) {
            return {
                value: null,
                formattedValue: value,
                error: error
            };
        }

        return {
            value: time,
            formattedValue: this.formatValue(time),
            error: null
        };
    }

    private _validateParts(parts: number[]): NullableString {

        const hour = parts[0];
        if(hour < 0 || hour > 23) {
            return this.services.language.translate('Hour must be between 00 and 23.');
        }

        const minute = parts[1];
        if(minute < 0 || minute > 59) {
            return this.services.language.translate('Minute must be between 00 and 59.');
        }

        const seconds = parts[2];
        if(seconds < 0 || seconds > 59) {
            return this.services.language.translate('Second must be between 00 and 59.');
        }

        return null;
    }

    private _validateTime(time: TimeOnly): NullableString {

        return null;
    }
    private _formatToMaskParts(value: string): MaskPart[] {
        return formatToParts(value, {
            mask: this.options.mask,
            replacement: this.options.replacement,
        });
    }

    private _getHour(maskParts: MaskPart[]): NullableNumber {
        return this._extractTimePartFromMask(maskParts.slice(0, 2), false);
    }

    private _getMinute(maskParts: MaskPart[]): NullableNumber {
        return this._extractTimePartFromMask(maskParts.slice(3, 5), false);
    }

    private _getSeconds(maskParts: MaskPart[]): NullableNumber {
        return this._extractTimePartFromMask(maskParts.slice(6, 8), false);
    }

    private _extractTimePartFromMask(maskParts: MaskPart[], allowIncompletePart: boolean = false): NullableNumber {

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

    private _formatTimeMaskedString(time: TimeOnly): string {
        const timeParts = [
            this._padTimePart(time.hour),
            this._padTimePart(time.minute),
            this._padTimePart(time.second),
        ];


        return timeParts.join(':');
    }

    private _padTimePart(part: number): string {
        return part.toString().padStart(2, '0');
    }

}