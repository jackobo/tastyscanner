import {IDocumentService} from "./document.service.interface";
import {DocumentEventListenerRegistration} from "./document-event-listener-registration";

export class DocumentService implements IDocumentService {
    constructor() {
        this.subscribeTo = new DocumentEventListenerRegistration(document);
    }

    getElementById(id: string): HTMLElement | null {
        return document.getElementById(id);
    }

    readonly subscribeTo: DocumentEventListenerRegistration;

    get isVisible(): boolean {
        return document.visibilityState === "visible";
    }

    get body(): HTMLElement {
        return document.body;
    }

    get documentElement(): HTMLElement {
        return document.documentElement;
    }
}
