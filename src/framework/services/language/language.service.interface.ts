import {TranslationWithParams} from "./translation-with-params";
import {Locale} from "date-fns";



export interface ILanguageService {
    readonly currentLocale: Locale;
    translate(template: string): string;
    translationFor(template: string): TranslationWithParams
}
