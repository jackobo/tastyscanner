import {
    ILoadingIndicator,
    ILoadingIndicatorService,
    IShowLoadingIndicatorOptions
} from "./loading-indicator.service.interface";
import {makeObservable, observable, runInAction} from "mobx";
import {IRoutingGuard, RoutingGuardContext, RoutingGuardResult} from "../navigator/navigator.service.interface";
import {ValidationError} from "../../types/validation-error";
import {IFrameworkServiceFactory} from "../framework-service-factory.interface";
import {FrameworkServiceBase} from "../framework-service-base";


export class LoadingIndicatorService extends FrameworkServiceBase implements ILoadingIndicatorService, IRoutingGuard {
    constructor(services: IFrameworkServiceFactory) {
        super(services);
        makeObservable(this, {
            activeLoadingHandlers: observable
        });
        //this.services.navigator.registerRoutingGuard(this);
    }

    async canNavigate(context: RoutingGuardContext): Promise<RoutingGuardResult> {

        if(context.targetLocationIsHomePage) {
            return RoutingGuardResult.Allow;
        }

        if(context.isBackwardNavigation) {
            if(this.current) {
                return RoutingGuardResult.Block;
            } else {
                return RoutingGuardResult.Allow;
            }
        }

        return RoutingGuardResult.Allow;

    }

    activeLoadingHandlers: ILoadingIndicator[] = [];

    get current(): ILoadingIndicator | null {
        if(this.activeLoadingHandlers.length === 0) {
            return null;
        }

        return this.activeLoadingHandlers[this.activeLoadingHandlers.length - 1];
    }



    async execute<TResult = any>(options: IShowLoadingIndicatorOptions): Promise<TResult> {

        let loadingHandler: LoadingIndicatorHandler | null = null;
        loadingHandler = new LoadingIndicatorHandler(this, options.showPromotionalMessage || false);
        runInAction(() => {
            this.activeLoadingHandlers.push(loadingHandler!);
        });

        try {
            const result = await options.action();
            loadingHandler?.close();
            return result;
        }
        catch (err) {

            loadingHandler?.close();

            if(options.displayExceptionHandler) {
                options.displayExceptionHandler(err)
            } else {
                this._handleExceptionDisplay(err);
            }

            throw err;
        }
    }

    private _handleExceptionDisplay(exception: any): void {
        const genericErrorMsg = this.services.language.translate('There was an error processing your request');
        if(exception instanceof ValidationError) {
            this.services.alert.showError(exception.message);
        } else {
            this.services.logger.error('Async operation failed', exception);
            this.services.alert.showError(genericErrorMsg);
        }
    }
}

class LoadingIndicatorHandler implements ILoadingIndicator {
    constructor(private readonly loadingIndicatorService: LoadingIndicatorService,
                public readonly showPromotionalMessage: boolean) {
    }

    close() {
        const activeIndicatorHandlers = this.loadingIndicatorService.activeLoadingHandlers;
        const index = activeIndicatorHandlers.findIndex(h => h === this);
        if(index >= 0) {
            runInAction(() => {
                activeIndicatorHandlers.splice(index, 1);
            });
        }
    }
}
