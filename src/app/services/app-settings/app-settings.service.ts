import {AppServiceBase} from "../app-service-base";
import {IAppSettingsFields, IAppSettingsService} from "./app-settings.service.interface";
import {AppFormModel} from "../../models/forms/app-form.model";
import {IAppServiceFactory} from "../app-service-factory.interface";
import {FormFields} from "../../../framework/models/forms/form-field.interface";
import {makeObservable, observable, runInAction} from "mobx";
import {AppLocalStorageKeys} from "../storage/app-local-storage-keys";

export class AppSettingsService extends AppServiceBase implements IAppSettingsService {
    constructor(services: IAppServiceFactory) {
        super(services);
        this._currentSettings = this.services.localStorage.getJson<IAppSettingsFields>(AppLocalStorageKeys.appSettings);
        this._form = new AppSettingsForm(services);
        makeObservable<this, '_currentSettings'>(this, {
            _currentSettings: observable.ref
        })
    }

    private readonly _form: AppSettingsForm;

    private _currentSettings: IAppSettingsFields | null = null;
    get currentSettings(): IAppSettingsFields | null {
        return this._currentSettings;
    }

    get fields(): FormFields<IAppSettingsFields> {
        return this._form.fields;
    }

    get hasChanges(): boolean {
        return this._form.hasChanges();
    }

    save(): void {
        if(this._form.activateErrorsValidation().length > 0) {
            return;
        }

        this._form.commitChanges();

        runInAction(() => {
            this._currentSettings = {
                tastyRefreshToken: this.fields.tastyRefreshToken.value!.trim(),
                tastyClientSecret: this.fields.tastyClientSecret.value!.trim()
            }

            this.services.localStorage.setJson(AppLocalStorageKeys.appSettings, this._currentSettings);
        })
    }

    discardChanges(): void {
        this._form.cancelChanges();
    }
}


class AppSettingsForm extends AppFormModel<IAppSettingsFields> {
    constructor(services: IAppServiceFactory) {
        super(services,);
    }

    protected _createFields(): FormFields<IAppSettingsFields> {
        return  {
            tastyRefreshToken: this._createField<string>( {
                fieldName: () =>this.services.language.translate('Tasty refresh token'),
                initialValue: () => this.services.appSettings.currentSettings?.tastyRefreshToken ?? null
            }),
            tastyClientSecret: this._createField<string>( {
                fieldName: () =>this.services.language.translate('Tasty client secret'),
                initialValue: () => this.services.appSettings.currentSettings?.tastyClientSecret ?? null
            })
        }
    }
}