import {toast, ToastOptions} from 'react-toastify';
import type {IToasterService, IToastHandler} from './toaster.service.interface';
import {ShowToastOptions} from "./toaster.service.interface";

export class ToasterService implements IToasterService {

  constructor() {
    this._containerElementRefPromise = new Promise(resolve => this._containerElementRefPromiseResolver = resolve);
  }

  private readonly _containerElementRefPromise: Promise<HTMLElement>;
  private _containerElementRefPromiseResolver: null | ((value: HTMLElement | PromiseLike<HTMLElement>) => void) = null;


  setContainerElementRef(elementRef: HTMLElement): void {
    if(this._containerElementRefPromiseResolver) {
      this._containerElementRefPromiseResolver(elementRef);
    }
  }

  async waitForContainerElementRef(): Promise<void> {
    await this._containerElementRefPromise;
  }

  private async _executeShowToast<TResult>(callback: () => TResult): Promise<TResult> {
    await this.waitForContainerElementRef();
    return callback();

  }

  public async showToast(options: ShowToastOptions): Promise<IToastHandler> {
    return await this._executeShowToast(() => {
      const toastId = toast(options.renderContent(), this._createToastOptions(options));

      return new ToastHandler(toastId);
    })
  }




  public async showInfoToast(options: ShowToastOptions): Promise<IToastHandler> {
    return await this._executeShowToast(() => {
      const toastId = toast.info(options.renderContent(), this._createToastOptions(options));

      return new ToastHandler(toastId);
    })
  }


  async showErrorToast(options: ShowToastOptions): Promise<IToastHandler> {

    return await this._executeShowToast(() => {
      const toastId = toast.error(options.renderContent(), this._createToastOptions(options));

      return new ToastHandler(toastId);
    })

  }

  private _createToastOptions(options: ShowToastOptions): ToastOptions<any> {
    return {
      autoClose: options.autoCloseTime ? options.autoCloseTime.totalMilliseconds : false,
      closeOnClick: false,
      draggable: false,
      closeButton: true,
      onClose: options.onClose
    };
  }
}

class ToastHandler implements IToastHandler {


  constructor(private readonly toastId: number | string) {
    this.toastId = toastId;
  }

  close(): void {
    toast.dismiss(this.toastId);
  }
}