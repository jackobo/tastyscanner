import {NullableNumber} from "../utils/nullable-types";

export interface IOptionViewModel {
    readonly lastPrice: NullableNumber;
    readonly delta: NullableNumber;
}