import {TrackingData} from "@react-input/mask";
import {UndefinedString} from "../../../types/nullable-types";

const digitRegEx = /\d/;

export class DateInputTracker {
    constructor(private readonly trackData: TrackingData) {
    }

    private readonly datePartsSeparators: Record<number, string> = {
        2: '/',
        5: '/',
        10: ' ',
        13: ':',
        16: ':'
    }



    track(): UndefinedString | boolean {
        if(this.trackData.inputType === "deleteBackward" || this.trackData.inputType === "deleteForward") {
            return this.trackRemoval();
        } else {
            return this.trackInput();
        }
    }


    private trackRemoval(): UndefinedString | boolean {
        const trackData = this.trackData;

        if(trackData.selectionStart + 1 === trackData.value.length) {
            //it means we are removing characters from the end then we keep InputMask default behavior
            return undefined;
        }

        if((trackData.selectionEnd - trackData.selectionStart) === trackData.value.length) {
            //it means we are removing the whole value, so we let InputMask default behavior
            return undefined;
        }

        if(trackData.selectionStart + 1 < trackData.selectionEnd) {
            //if we try to remove a range of characters
            if(this._getSeparatorsPositions().some(position => trackData.selectionStart <= position && position < trackData.selectionEnd)) {
                //then if the range contains a date separator we deny the removal
                return false;
            } else {
                //otherwise we keep the default InputMask behavior
                return undefined;
            }
        }

        for(const position of this._getSeparatorsPositions()) {
            if(position === trackData.selectionStart) {
                return this.datePartsSeparators[position];
            }
        }

        return undefined;
    }



    private trackInput(): UndefinedString {
        const trackData = this.trackData;
        const inputChar = trackData.data ?? "";

        if(inputChar.length !== 1) {
            return undefined;
        }

        if(!inputChar.match(digitRegEx)) {
            return undefined;
        }

        for(const position of this._getSeparatorsPositions()) {
            if(position === trackData.selectionStart) {
                return `${this.datePartsSeparators[position]}${inputChar}`;
            }
        }

        return undefined;
    }

    private _getSeparatorsPositions(): number[] {
        return Object.keys(this.datePartsSeparators).map(position => parseInt(position));
    }

}