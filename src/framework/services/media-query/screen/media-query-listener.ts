import {action, makeObservable, observable, runInAction} from "mobx";

interface IMediaQueryData {
    matches: boolean;
    media: string;
}

export class MediaQueryListener {
    constructor(public media: string) {
        this.mediaQueryList = window.matchMedia(media);

        if (this.mediaQueryList.addEventListener) {
            this.mediaQueryList.addEventListener("change", this.onChangeEventListener);
        } else if (this.mediaQueryList.addListener) {
            this.mediaQueryList.addListener(this.onChangeEventListener);
        } else if (this.mediaQueryList.onchange) {
            this.mediaQueryList.onchange = this.onChangeEventListener;
        } else {
            throw new Error("Cannot subscribe to MediaQueryList change event");
        }
        this.onChangeEventListener(this.mediaQueryList);
        makeObservable(this, {
            isMatched: observable.ref,
            onChangeEventListener: action.bound
        })
    }

    isMatched: boolean = false;
    private readonly mediaQueryList: MediaQueryList;


    onChangeEventListener = (mQueryEventData: IMediaQueryData) => {
        runInAction(() => {
            this.isMatched = mQueryEventData.matches;
        });

    }

    dispose() {
        if (this.mediaQueryList.removeEventListener) {
            this.mediaQueryList.removeEventListener("change", this.onChangeEventListener);
        } else if (this.mediaQueryList.removeListener) {
            this.mediaQueryList.removeListener(this.onChangeEventListener);
        }
    }
}
