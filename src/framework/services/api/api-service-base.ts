import {IStandardApiJsonResponse} from "../../models/standard-api-json-response.interface";
import {ServiceBase} from "../service-base";
import {ApiResponseModel} from "../../models/api-response.model";
import {ApiErrorToastHandlerModel} from "../../components/api-error-toast/api-error-toast-handler.model";
import {IApiServiceBase} from "./api-service-base.interface";
import {IFrameworkServiceFactory} from "../framework-service-factory.interface";

interface FetchRequestOptions {
    method: string;
    endpoint: string;
    headers?: {
        [key: string]: string;
    };
    body?: object;
}

export abstract class ApiServiceBase<TServiceFactory extends IFrameworkServiceFactory> extends ServiceBase<TServiceFactory> implements IApiServiceBase {

    protected abstract _buildEndpointUrl(endpoint: string): string;
    private _toastsStack: ApiErrorToastHandlerModel<any>[] = [];

    protected async _fetch<TData>(options: FetchRequestOptions): Promise<ApiResponseModel<TData>> {
        const fetchRequest: RequestInit = {
            method: options.method,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            }
        }

        if(options.body) {
            fetchRequest.body = JSON.stringify(options.body);
        }

        let apiResponse: ApiResponseModel<TData>;
        try {
            const fetchResponse = await fetch(this._buildEndpointUrl(options.endpoint), fetchRequest)
            apiResponse = await this._parseStandardApiResponse<TData>(fetchResponse, options.endpoint);

        } catch (err) {
            apiResponse = new ApiResponseModel<TData>(false, undefined, options.endpoint, -1, "A network error occurred",
                err instanceof Error
                                ? err.message
                                : String(err));
        }

        this._showErrorToast(apiResponse);

        return apiResponse;

    }

    private _toastsSuspended: boolean = false;
    suspendToasts() {
        this._toastsSuspended = true;
    }

    resumeToasts() {
        this._toastsSuspended = false;
    }

    private _showErrorToast<TData>(apiResponse: ApiResponseModel<TData>): void {
        if(apiResponse.isSuccess || this._toastsSuspended) {
            return;
        }

        const toastHandler = new ApiErrorToastHandlerModel<TData>(this.services, {
            apiResponse: apiResponse,
            onDismiss: handler => {
                const index = this._toastsStack.findIndex(t => t === handler);
                if(index >= 0) {
                    this._toastsStack.splice(index, 1);
                }
            }
        });

        this._toastsStack.push(toastHandler);
        if(this._toastsStack.length >= 5) {
            const oldestToast = this._toastsStack.shift();
            oldestToast?.closeToast();
        }
        toastHandler.show();

    }

    protected async get<TData>(endpoint: string): Promise<ApiResponseModel<TData>> {
        return await this._fetch<TData>({
            method: 'GET',
            endpoint: endpoint,
        });
    }

    protected async post<TData>(endpoint: string, payload?: object): Promise<ApiResponseModel<TData>> {
        return await this._fetch<TData>({
            method: 'POST',
            endpoint: endpoint,
            body: payload ?? {},
        });
    }

    protected async put<TData>(endpoint: string, payload?: object): Promise<ApiResponseModel<TData>> {
        return await this._fetch<TData>({
            method: 'PUT',
            endpoint: endpoint,
            body: payload ?? {},
        });
    }

    protected async patch<TData>(endpoint: string, payload?: object): Promise<ApiResponseModel<TData>> {
        return await this._fetch<TData>({
            method: 'PATCH',
            endpoint: endpoint,
            body: payload ?? {},
        });
    }

    protected async delete<TData>(endpoint: string, payload?: object): Promise<ApiResponseModel<TData>> {
        return await this._fetch<TData>({
            method: 'DELETE',
            endpoint: endpoint,
            body: payload,
        });
    }

    protected async _parseStandardApiResponse<TData>(apiResponse: Response, endpoint: string): Promise<ApiResponseModel<TData>> {
        if(apiResponse.ok) {
            const result: IStandardApiJsonResponse<TData> = await apiResponse.json();
            return new ApiResponseModel<TData>(!result.hasError,
                result.data,
                endpoint,
                result.errorCode,
                result.errorDescription,
                result.errorDetails);
        } else {
            const responseContent = await apiResponse.text();
            return new ApiResponseModel<TData>(false,
                undefined,
                endpoint,
                apiResponse.status,
                apiResponse.statusText,
                responseContent);
        }
    }
}