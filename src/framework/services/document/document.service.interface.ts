import {DocumentEventListenerRegistration} from "./document-event-listener-registration";

export interface IDocumentService {
    readonly isVisible: boolean;
    readonly subscribeTo: DocumentEventListenerRegistration;
    getElementById(id: string): HTMLElement | null;
    readonly body: HTMLElement;
    readonly documentElement: HTMLElement;
}
