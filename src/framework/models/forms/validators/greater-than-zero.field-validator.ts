import {IFieldValidator} from "../field-validator.interface";
import {NullableString} from "../../../types/nullable-types";
import {Check} from "../../../utils/type-checking";
import {IFrameworkServiceFactory} from "../../../services/framework-service-factory.interface";

export class GreaterThanZeroFieldValidator implements IFieldValidator {
    constructor(private readonly services: IFrameworkServiceFactory) {
    }
    validate(fieldValue: any): NullableString {
        if(!Check.isNumber(fieldValue)) {
            return null;
        }

        if(fieldValue > 0) {
            return null;
        }

        return this.services.language.translate('Must be greater than zero');
    }

}