import {Check} from "../../utils/type-checking";


export class TranslationWithParams {
    constructor(private readonly translationKey: string) {
    }

    withParams(params: string[] | Record<string, string | number | boolean>): string {
        let template = this.translationKey;
        if(Check.isArray(params)) {
            params.forEach((paramValue, index) => {
                const regex = new RegExp('{' + index + '}', "g");
                template = template.replace(regex, paramValue);
            });

            return template;
        } else {
            Object.keys(params).forEach(paramName => {
                const regex = new RegExp('{' + paramName + '}', "g");
                template = template.replace(regex, params[paramName].toString());
            });
            return template;
        }
    }
}
