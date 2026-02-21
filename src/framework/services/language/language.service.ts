import {ILanguageService} from "./language.service.interface";
import {TranslationWithParams} from "./translation-with-params";
import {enGB} from 'date-fns/locale';

export class LanguageService implements ILanguageService {
    translate(template: string): string {
        return template;
    }

    translationFor(template: string): TranslationWithParams {
        return new TranslationWithParams(template);
    }

    readonly currentLocale = enGB;

}