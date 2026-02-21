import {DomEventSubscription} from "../window/window-event-listener-registration";

export class DocumentEventListenerRegistration {
    constructor(doc: Document) {
        this._document = doc;
    }

    private _document: Document;


    visibilityChange(handler: EventListenerOrEventListenerObject): DomEventSubscription {
        return this._subscribe('visibilitychange', handler);
    }



    private _subscribe = (eventName: string, handler: EventListenerOrEventListenerObject): DomEventSubscription => {
        this._document.addEventListener(eventName, handler, false);
        return {
            unsubscribe: () => this._document?.removeEventListener(eventName, handler)
        }
    }
}


