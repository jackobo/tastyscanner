import {Check} from "../utils/type-checking";
import {NullableUndefinedString} from "./nullable-types";

export class TimeOnly {
    constructor(public readonly hour: number,
                public readonly minute: number,
                public readonly  second: number,
                public readonly  millisecond: number,
                isUtc?: boolean) {
        this.isUtc = Boolean(isUtc);
    }

    public readonly isUtc: boolean;

    toString(): string {
        const parts: string[] = [];

        parts.push(this.hour.toString().padStart(2, '0'));
        parts.push(this.minute.toString().padStart(2, '0'));
        parts.push(this.second.toString().padStart(2, '0'));

        const result = parts.join(':');
        if(this.millisecond > 0) {
            return `${result}.${this.millisecond.toString().padStart(3, '0')}`;
        }
        return result
    }


    public static parseUtc(timeString: NullableUndefinedString): TimeOnly {
        return TimeOnly.parse(timeString, true);
    }

    public static parseLocal(timeString: NullableUndefinedString): TimeOnly {
        return TimeOnly.parse(timeString, false);
    }

    private static parse(timeString: NullableUndefinedString, isUtc?: boolean): TimeOnly {
        const {time, error} = TimeOnly._tryParseInternal(timeString, isUtc);

        if(time) {
            return time;
        }

        throw new Error(error || 'Failed to parse TimeOnly');
    }

    public static tryParseLocal(timeString: NullableUndefinedString): TimeOnly | null {
        return TimeOnly.tryParse(timeString, false);
    }

    public static tryParseUtc(timeString: NullableUndefinedString): TimeOnly | null {
        return TimeOnly.tryParse(timeString, true);
    }

    public static compare(time1: NullableTimeOnly, time2: NullableTimeOnly): number {
        if(!time1 && !time2) {
            return 0;
        }

        if(!time1) {
            return -1;
        }

        if(!time2) {
            return 1;
        }

        const totalMilliseconds1 = time1.totalMilliseconds;
        const totalMilliseconds2 = time2.totalMilliseconds;

        if(totalMilliseconds1 < totalMilliseconds2) {
            return -1;
        }

        if(totalMilliseconds1 > totalMilliseconds2) {
            return 1;
        }

        return 0;
    }

    private static tryParse(timeString: NullableUndefinedString, isUtc?: boolean): TimeOnly | null {
        const {time} = this._tryParseInternal(timeString, isUtc);

        if(time) {
            return time;
        }

        return null;
    }

    private static _tryParseInternal(timeString: NullableUndefinedString, isUtc?: boolean): {time?: TimeOnly; error?: string} {
        if(!timeString) {
            return {error: 'Empty time string'};
        }

        const parts = timeString.split(':');
        if(parts.length < 2 || parts.length > 3) {
            return {error: 'Invalid time format'};
        }

        const hour = parseInt(parts[0]);
        if(!Check.isNumber(hour)) {
            return {error: 'Invalid hour value'};
        }

        const minute = parseInt(parts[1]);
        if(!Check.isNumber(minute)) {
            return {error: 'Invalid minute value'};
        }

        let second = 0;
        let millisecond = 0;
        if(parts.length === 3) {
            const secondAndMillisecond = parts[2].split('.');
            if(secondAndMillisecond.length > 0 && secondAndMillisecond.length <= 2) {
                second = parseInt(secondAndMillisecond[0]);
                if(!Check.isNumber(second)) {
                    return {error: 'Invalid second value'};
                }

                if(secondAndMillisecond.length === 2) {
                    millisecond = parseInt(secondAndMillisecond[1]);
                    if(!Check.isNumber(millisecond) || millisecond > 999) {
                        return {error: 'Invalid millisecond value'};
                    }
                }
            }
        }

        return {
            time: new TimeOnly(hour, minute, second, millisecond, isUtc)
        };
    }

    toLocalTime(): TimeOnly {
        if(!this.isUtc) {
            return this;
        }

        const now = new Date();
        now.setUTCHours(this.hour, this.minute, this.second, this.millisecond);

        const hour = now.getHours();
        const minute = now.getMinutes();
        const second = now.getSeconds();
        const millisecond = now.getMilliseconds();

        return new TimeOnly(hour, minute, second, millisecond, false);
    }

    toUTCTime(): TimeOnly {

        if(this.isUtc) {
            return this;
        }

        const now = new Date();
        now.setHours(this.hour, this.minute, this.second, this.millisecond);

        const utcHours = now.getUTCHours();
        const utcMinutes = now.getUTCMinutes();
        const utcSeconds = now.getUTCSeconds();
        const utcMilliseconds = now.getUTCMilliseconds();

        return new TimeOnly(utcHours, utcMinutes, utcSeconds, utcMilliseconds, true);
    }

    equalTo(theOther: NullableTimeOnly): boolean {
        if(!theOther) {
            return false;
        }

        return this.hour === theOther.hour
            && this.minute === theOther.minute
            && this.second === theOther.second
            && this.millisecond === theOther.millisecond
            && this.isUtc === theOther.isUtc;
    }

    greaterThan(theOther: NullableTimeOnly): boolean {
        if(!theOther) {
            return true;
        }

        return this.totalMilliseconds > theOther.totalMilliseconds;
    }

    greaterThanOrEqual(theOther: NullableTimeOnly): boolean {
        if(!theOther) {
            return true;
        }

        return this.totalMilliseconds >= theOther.totalMilliseconds;
    }

    lessThan(theOther: NullableTimeOnly): boolean {
        if(!theOther) {
            return false;
        }

        return this.totalMilliseconds < theOther.totalMilliseconds;
    }

    lessThanOrEqual(theOther: NullableTimeOnly): boolean {
        if(!theOther) {
            return false;
        }

        return this.totalMilliseconds <= theOther.totalMilliseconds;
    }


    get totalMilliseconds(): number {
        return (this.hour * 3600000) + (this.minute * 60000) + (this.second * 1000) + this.millisecond;
    }
}

export type NullableTimeOnly = TimeOnly | null;