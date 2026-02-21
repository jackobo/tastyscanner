import {FormFields} from "../../../framework/models/forms/form-field.interface";

export interface IAppSettingsService {
    readonly fields: FormFields<IAppSettingsFields>;
    save(): void;
    discardChanges(): void;
    readonly hasChanges: boolean;
    readonly currentSettings: IAppSettingsFields | null;
}

export interface IAppSettingsFields {
    tastyRefreshToken: string;
    tastyClientSecret: string;
}