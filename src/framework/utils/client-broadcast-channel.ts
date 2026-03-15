import {IFrameworkServiceFactory} from "../services/framework-service-factory.interface";


export interface IOrbitBroadcastChannelSubscription {
    unsubscribe(): void;
}

export class ClientBroadcastChannel<TMessage> {
    constructor(private readonly channelName: string, private readonly services: IFrameworkServiceFactory) {
        this._broadcastChannel = new BroadcastChannel(channelName);
        this._broadcastChannel.addEventListener('message', this._channelMessageHandler);
        this._broadcastChannel.addEventListener('messageerror', this._channelMessageErrorHandler);
    }

    private readonly _broadcastChannel: BroadcastChannel;

    private _subscribers: Array<(message: TMessage) => void> = [];

    sendMessage(message: TMessage): void {
        this._broadcastChannel.postMessage(message);
    }

    close(): void {
        this._subscribers = [];
        this._broadcastChannel.removeEventListener('message', this._channelMessageHandler);
        this._broadcastChannel.close();
    }


    private _channelMessageHandler = (event: MessageEvent<TMessage>) => {
        if(!event.data) {
            return;
        }

        for(const subscriber of this._subscribers) {
            try {
                subscriber(event.data);
            } catch (err) {
                this.services.logger.error(`${this.channelName} channel message subscriber failed`, err);
            }
        }
    }

    private _channelMessageErrorHandler = (event: MessageEvent<TMessage>) => {
        this.services.logger.error(`Sending message over ${this.channelName} channel failed`, event);
    }

    subscribe(subscriber: (message: TMessage) => void): IOrbitBroadcastChannelSubscription {
        this._subscribers.push(subscriber);
        return {
            unsubscribe: () => {
                const index = this._subscribers.findIndex(s => s === subscriber);
                if(index >= 0) {
                    this._subscribers.splice(index, 1);
                }
            }
        };
    }
}