
export interface IApiErrorToastHandlerViewModel {
    readonly endpoint: string;
    readonly errorCode: string;
    readonly errorDescription: string;
    readonly errorDetails: string;
    readonly isDialogShown: boolean;
    closeToast(): void;
    showDetails(): Promise<void>;

}