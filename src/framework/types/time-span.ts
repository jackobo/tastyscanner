import {ILanguageService} from "../services/language/language.service.interface";
import {Check} from "../utils/type-checking";



const MILLIS_PER_SECOND = 1000;
const MILLIS_PER_MINUTE = MILLIS_PER_SECOND * 60;   //     60,000
const MILLIS_PER_HOUR = MILLIS_PER_MINUTE * 60;     //  3,600,000
const MILLIS_PER_DAY = MILLIS_PER_HOUR * 24;        // 86,400,000

interface IToUserFriendlyStringOptions {
    convertDaysToHoursIfLessThan?: number;
    useShortFormat?: boolean;
    ignoreSeconds?: boolean;
}

interface IFriendlyTranslations {
    one: Record<number, string>;
    many: Record<number, string>;
    andOne: Record<number, string>;
    andMany: Record<number, string>
}

interface ITimeSpanValues {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export class TimeSpan {

    private readonly _totalMilliseconds: number = 0;

    constructor(days: number, hours: number, minutes: number, seconds: number = 0, milliseconds: number = 0) {
        const totalMilliseconds = days * MILLIS_PER_DAY
            + hours * MILLIS_PER_HOUR
            + minutes * MILLIS_PER_MINUTE
            + seconds * MILLIS_PER_SECOND
            + Math.floor(milliseconds); // only milliseconds will be "trimmed"

        // try to avoid double number issue
        this._totalMilliseconds = Math.round(totalMilliseconds);
    }

    private _getSign() : number {
        if(this._totalMilliseconds < 0) {
            return -1;
        } else {
            return 1;
        }
    }

    static get Zero(): TimeSpan {
        return TimeSpan.fromMilliseconds(0);
    }

    private _floor(value: number): number {
        return this._getSign() * Math.floor(Math.abs(value));
    }

    get days(): number {
        return this._floor(this.totalDays);
    }

    get hours(): number {
        return this._floor(this.totalHours % 24);
    }

    get minutes(): number {
        return this._floor(this.totalMinutes % 60);
    }

    get seconds(): number {
        return this._floor(this.totalSeconds % 60);
    }

    get milliseconds(): number {
        return this._floor(this._totalMilliseconds % MILLIS_PER_SECOND);
    }

    get totalDays(): number {
        return this._totalMilliseconds / MILLIS_PER_DAY;
    }

    get totalHours(): number {
        return this._totalMilliseconds / MILLIS_PER_HOUR;
    }

    get totalMinutes(): number {
        return this._totalMilliseconds / MILLIS_PER_MINUTE;
    }

    get totalSeconds(): number {
        return this._totalMilliseconds / MILLIS_PER_SECOND;
    }

    get totalMilliseconds(): number {
        return this._totalMilliseconds;
    }

    static areEquals(ts1: TimeSpan, ts2: TimeSpan) {
        return ts1.totalMilliseconds === ts2.totalMilliseconds;
    }

    static parse(text: string | null | undefined) {
        if(!text) {
            throw new Error('Null, undefined or empty string not allowed for TimeSpan format');
        }

        let sign = 1;

        if(text.startsWith('-')) {
            sign = -1;
            text = text.substring(1);
        }

        const components = text.split(/:/);
        if(components.length < 2) {
            throw new Error('Invalid TimeSpan input format ' + text);
        }

        let days = 0;
        let hours = 0;
        let minutes = 0;
        let seconds = 0;
        let milliseconds = 0;

        const daysAndHours = components[0].split(/\./);
        if(daysAndHours.length === 2) {
            days = parseInt(daysAndHours[0]);
            hours = parseInt(daysAndHours[1]);
        } else {
            hours = parseInt(daysAndHours[0]);
        }

        minutes = parseInt(components[1]);

        if(components.length === 3) { // it means we have seconds and/or milliseconds
            const secondsAndMilliseconds = components[2].split(/\./);
            if(secondsAndMilliseconds.length === 2) { // it means we have seconds and milliseconds
                seconds = parseInt(secondsAndMilliseconds[0]);
                milliseconds = TimeSpan._parseMilliseconds(secondsAndMilliseconds[1]);
            } else { // it means we have seconds without milliseconds
                seconds = parseInt(secondsAndMilliseconds[0]);
            }
        }
        return new TimeSpan(sign * days, sign * hours, sign * minutes, sign * seconds, sign * milliseconds);
    }

    static _parseMilliseconds(ms: string): number {
        let milliseconds = parseInt(ms);

        if(milliseconds <= 999) {
            return milliseconds;
        }

        while(milliseconds > 999) {
            milliseconds = milliseconds / 10;
        }

        return Math.round(milliseconds);
    }

    static fromMilliseconds(totalMilliseconds: number): TimeSpan {
        return new TimeSpan(0, 0, 0, 0, totalMilliseconds);
    }

    static fromSeconds(totalSeconds: number): TimeSpan {
        return new TimeSpan(0, 0, 0, totalSeconds, 0);
    }

    static fromMinutes(totalMinutes: number): TimeSpan {
        return new TimeSpan(0, 0, totalMinutes, 0, 0);
    }

    static fromHours(totalHours: number): TimeSpan {
        return new TimeSpan(0, totalHours, 0, 0, 0);
    }

    static fromDays(days: number): TimeSpan {
        return new TimeSpan(days, 0, 0, 0, 0);
    }

    subtract(timeSpan: TimeSpan): TimeSpan {
        if(!timeSpan) {
            throw new Error('timeSpan argument cannot be null or undefined');
        }

        const milliseconds = this.totalMilliseconds - timeSpan.totalMilliseconds;
        return TimeSpan.fromMilliseconds(milliseconds);
    }

    add(timeSpan: TimeSpan): TimeSpan {
        if(!timeSpan) {
            throw new Error('timeSpan argument cannot be null or undefined');
        }

        const totalMilliseconds = this.totalMilliseconds + timeSpan.totalMilliseconds;
        return TimeSpan.fromMilliseconds(totalMilliseconds);
    }

    public toString(options: {useTotalHours?: boolean} = {}): string {

        // special negative case (we treat it like '-'+normal positive toString() result)
        if (this._totalMilliseconds < 0)
            return '-' + TimeSpan.fromMilliseconds(-this._totalMilliseconds).toString({useTotalHours: options.useTotalHours});

        let result = '';
        if (!options.useTotalHours) {
            if(this.days > 0) {
                result += this.days.toString() + '.';
            }
            result += this.hours.toString().padStart(2, '0') + ':';
        } else {
            result += this._floor(this.totalHours).toString().padStart(2, '0') + ':';
        }

        result += this.minutes.toString().padStart(2, '0') + ':';
        result += this.seconds.toString().padStart(2, '0');

        if(this.milliseconds > 0) {
            result += '.' + this.milliseconds.toString().padStart(3, '0');
        }

        return result;
    }

    public toHoursAndMinutesString(): string {
        return this.hours.toString().padStart(2, '0') + ':' + this.minutes.toString().padStart(2, '0');
    }

    public toMinutesAndSecondsString(): string {
        return this.minutes.toString().padStart(2, '0') + ':' + this.seconds.toString().padStart(2, '0');
    }

    public toLocalTime(): TimeSpan {
        const localTime = new Date();
        localTime.setUTCHours(this.hours);
        localTime.setUTCMinutes(this.minutes);
        localTime.setUTCSeconds(this.seconds);
        localTime.setUTCMilliseconds(this.milliseconds);

        return new TimeSpan(0, localTime.getHours(), localTime.getMinutes(), localTime.getSeconds(), localTime.getMilliseconds());
    }

    private _getTranslationsLongFormat(language: ILanguageService, values: ITimeSpanValues): IFriendlyTranslations {
        return {
            one: {
                0: language.translate('one day'),
                1: language.translate('one hour'),
                2: language.translate('one minute'),
                3: language.translate('one second'),
            },
            andOne: {
                0: language.translate('and one day'),
                1: language.translate('and one hour'),
                2: language.translate('and one minute'),
                3: language.translate('and one second'),
            },
            many: {
                0: language.translationFor('{x} days').withParams({x: values.days}),
                1: language.translationFor('{x} hours').withParams({x: values.hours}),
                2: language.translationFor('{x} minutes').withParams({x: values.minutes}),
                3: language.translationFor('{x} seconds').withParams({x: values.seconds})
            },
            andMany: {
                0: language.translationFor('and {x} days').withParams({x: values.days}),
                1: language.translationFor('and {x} hours').withParams({x: values.hours}),
                2: language.translationFor('and {x} minutes').withParams({x: values.minutes}),
                3: language.translationFor('and {x} seconds').withParams({x: values.seconds})
            }
        }
    }

    private _getTranslationsShortFormat(language: ILanguageService, values: ITimeSpanValues): IFriendlyTranslations {
        const one: Record<number, string> = {
            0: language.translate('1day'),
            1: language.translate('1h'),
            2: language.translate('1min'),
            3: language.translate('1sec'),
        };
        const many: Record<number, string> = {
            0: language.translationFor('{x}days').withParams({x: values.days}),
            1: language.translationFor('{x}h').withParams({x: values.hours}),
            2: language.translationFor('{x}min').withParams({x: values.minutes}),
            3: language.translationFor('{x}sec').withParams({x: values.seconds})
        };

        return {
            one: one,
            andOne: one,
            many: many,
            andMany: many
        }
    }

    private _getTranslations(language: ILanguageService, values: ITimeSpanValues, useShortFormat: boolean): IFriendlyTranslations {
        if(useShortFormat) {
            return this._getTranslationsShortFormat(language, values);
        } else {
            return this._getTranslationsLongFormat(language, values);
        }
    }

    toUserFriendlyString(language: ILanguageService, options?: IToUserFriendlyStringOptions): string {

        options = {
            useShortFormat: false,
            ignoreSeconds: false,
            ...options
        }

        const values: ITimeSpanValues = {
            days: this.days,
            hours: this.hours,
            minutes: this.minutes,
            seconds: this.seconds
        }


        if(!Check.isNullOrUndefined(options.convertDaysToHoursIfLessThan) && values.days < options.convertDaysToHoursIfLessThan) {
            values.hours += values.days * 24;
            values.days = 0;
        }

        if(options.ignoreSeconds) {
            values.seconds = 0;
        }

        const translations = this._getTranslations(language, values, options.useShortFormat || false);

        const valuesArray = [values.days, values.hours, values.minutes, values.seconds];
        const parts: string[] = [];

        valuesArray.forEach((value, index) => {

            if(0 < valuesArray.filter((previousValue, i) => previousValue > 0 && i < index).length
                && 0 === valuesArray.filter((nextValue, i) => nextValue > 0 && i > index).length) {
                // if there are any previous values greater than zero and all next values are zero
                // it means this is the last part and we must append "and" before
                if(value === 1) {
                    parts.push(translations.andOne[index]);
                } else if(value > 1) {
                    parts.push(translations.andMany[index]);
                }
            } else {
                if(value === 1) {
                    parts.push(translations.one[index]);
                } else if(value > 1) {
                    parts.push(translations.many[index]);
                }
            }
        })

        return parts.join(' ');
    }
}
