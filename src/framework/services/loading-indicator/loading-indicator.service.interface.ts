export const LOADING_INDICATOR_CONTAINER_ELEMENT_ID = 'loading-indicator-container-id';

export interface ILoadingIndicator {
    readonly showPromotionalMessage: boolean;
    close(): void;

}

export interface IShowLoadingIndicatorOptions<TActionResult = any> {
    showPromotionalMessage?: boolean;
    action: () => Promise<TActionResult>;
    displayExceptionHandler?: (exception: any) => void
}

export interface ILoadingIndicatorService {
    current: ILoadingIndicator | null;
    execute<TResult = any>(options: IShowLoadingIndicatorOptions<TResult>): Promise<TResult>;
}
