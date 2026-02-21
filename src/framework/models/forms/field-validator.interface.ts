import {NullableString} from "../../types/nullable-types";

export interface IFieldValidator {
    validate(fieldValue: any): NullableString;
}
