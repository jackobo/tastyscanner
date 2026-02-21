import {toast, ToastOptions} from 'react-toastify';
import type {IToasterService, IToastHandler} from './toaster.service.interface';
import {ShowToastOptions} from "./toaster.service.interface";

export class ToasterService implements IToasterService {

  public showToast(options: ShowToastOptions): IToastHandler {
    const toastId = toast(options.renderContent(), this._createToastOptions(options));

    return new ToastHandler(toastId);
  }


  public showInfoToast(options: ShowToastOptions): IToastHandler {
    const toastId = toast.info(options.renderContent(), this._createToastOptions(options));

    return new ToastHandler(toastId);

  }


  showErrorToast(options: ShowToastOptions): IToastHandler {

    const toastId = toast.error(options.renderContent(), this._createToastOptions(options));

    return new ToastHandler(toastId);
  }

  private _createToastOptions(options: ShowToastOptions): ToastOptions<any> {
    return {
      autoClose: false,
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