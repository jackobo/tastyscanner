import {FormModel} from "../../../framework/models/forms/form.model";
import {IAppServiceFactory} from "../../services/app-service-factory.interface";

export abstract class AppFormModel<TFields> extends FormModel<TFields, IAppServiceFactory>{
}