import {TimeSpan} from "../types/time-span";

export class Debounce {
    constructor(private readonly timeout: TimeSpan) {

    }

    private _isEnabled: boolean = true;

    disable(): void {
        this._isEnabled = false;
    }

    enable(): void {
        this._isEnabled = true;
    }

    private _timeoutRef: any = null;

    execute(callback: () => void) {
        clearTimeout(this._timeoutRef);
        if(this._isEnabled) {
            this._timeoutRef = setTimeout(callback, this.timeout.totalMilliseconds);
        }

    }

    dispose(): void {
        clearTimeout(this._timeoutRef);
    }
}