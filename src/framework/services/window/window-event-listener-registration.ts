export interface DomEventSubscription {
    unsubscribe(): void;
}

export class WindowEventListenerRegistration {
    constructor(win: Window) {
        this._window = win;
    }

    private _window: Window;


    postMessage(handler: EventListenerOrEventListenerObject): DomEventSubscription {
        return this._subscribe('message', handler);
    }

    popState(handler: (event: PopStateEvent) => void): DomEventSubscription {
        this._window.addEventListener('popstate', handler, false);
        return {
            unsubscribe: () => this._window.removeEventListener('popstate', handler)
        }
    }

    scroll(handler: (event: Event) => void): DomEventSubscription {
        return this._subscribe('scroll', handler);
    }

    private _subscribe = (eventName: string, handler: EventListenerOrEventListenerObject): DomEventSubscription => {
        this._window.addEventListener(eventName, handler, false);
        return {
            unsubscribe: () => this._window.removeEventListener(eventName, handler)
        }
    }

}
