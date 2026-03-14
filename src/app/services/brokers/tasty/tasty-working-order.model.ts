import {IWorkingOrderViewModel} from "../interfaces/working-order.interfaces";
import {ITastyOrderRawData} from "./raw-data/tasty-order.raw-data.interfaces";
import {ORDERS_SOURCE_NAME} from "../constants";
import TastyTradeClient from "@tastytrade/api";
import {IAppServiceFactory} from "../../app-service-factory.interface";
import {AppLocalStorageKeys} from "../../storage/app-local-storage-keys";
import {Check} from "../../../../framework/utils/type-checking";
import {
    NullableString,
    NullableUndefinedString
} from "../../../../framework/types/nullable-types";

export class TastyWorkingOrderModel implements IWorkingOrderViewModel {
    constructor(private readonly tastyOrderRawData: ITastyOrderRawData,
                private readonly tastyClient: TastyTradeClient,
                private readonly services: IAppServiceFactory) {
        this._replaceAttemptsStorageHandler = new ReplaceAttemptsStorageHandler(tastyOrderRawData, services);
    }

    private readonly _replaceAttemptsStorageHandler: ReplaceAttemptsStorageHandler;

    get id(): string {
        return this.tastyOrderRawData.id.toString();
    }

    private get orderIdAsNumber() {
        return this.tastyOrderRawData.id;
    }

    get underlyingSymbol(): string {
        return this.tastyOrderRawData.underlyingSymbol;
    }

    get tradingPrice(): number {
        return parseFloat(this.tastyOrderRawData.price);
    }

    get isGobyOrder(): boolean {
        return this.tastyOrderRawData.source === ORDERS_SOURCE_NAME;
    }

    private get accountNumber(): string {
        return this.tastyOrderRawData.accountNumber;
    }

    async replace(): Promise<void> {
        if(!this.isGobyOrder) {
            return;
        }

        if(this._replaceAttemptsStorageHandler.numberOfReplaceAttempts >= 3) {
            return;
        }

        this._replaceAttemptsStorageHandler.numberOfReplaceAttempts++;

        let newPrice = this.tradingPrice;
        if(this.tastyOrderRawData.priceEffect === "Credit") {
            newPrice = this.tradingPrice - 0.01; //make it a little bit cheaper to get filled
        } else if(this.tastyOrderRawData.priceEffect === "Debit") {
            newPrice = this.tradingPrice + 0.01; //make it a little bit expensive to get filled
        }

        try {
            await this.tastyClient.orderService.replaceOrder(this.accountNumber, this.orderIdAsNumber, {
                "order-type": this.tastyOrderRawData.orderType,
                "time-in-force": this.tastyOrderRawData.timeInForce,
                "price": newPrice,
                "price-effect": this.tastyOrderRawData.priceEffect,
                "source": this.tastyOrderRawData.source,
                "legs": this.tastyOrderRawData.legs.map(leg => {
                    return {
                        "action": leg.action,
                        "instrument-type": leg.instrumentType,
                        "quantity": leg.quantity,
                        "symbol": leg.symbol
                    }
                })
            });
        } catch (err) {
            console.error(err);
            await this.services.toaster.showErrorToast({
                renderContent: () => this.services.language.translate(`Failed to replace order! ${err}`)
            });
        }

    }

    public  async cancel(): Promise<void> {
        try {
            await this.tastyClient.orderService.cancelOrder(this.accountNumber, this.orderIdAsNumber);
        } catch (err) {
            await this.services.toaster.showErrorToast({
                renderContent: () => this.services.language.translate(`Failed to cancel order! ${err}`)
            });
        }
    }
}

class ReplaceAttemptsStorageHandler {
    constructor(private readonly tastyOrderRawData: ITastyOrderRawData,
                private readonly services: IAppServiceFactory) {
        this._replaceStorageKey();
    }



    get numberOfReplaceAttempts(): number {
        const storedValue = this._getNumberOfReplaceAttemptsFromStorage();
        if(Check.isNullOrUndefined(storedValue)) {
            return 0;
        }

        const parsedValue = parseInt(storedValue);
        if(!Check.isNumber(parsedValue)) {
            return 0;
        }

        return parsedValue;
    }


    set numberOfReplaceAttempts(value: number) {
        this.services.localStorage.setItem(AppLocalStorageKeys.orderReplaceAttemptCount, value.toString(), this._getLocalStorageDiscriminator());
    }

    private _getLocalStorageDiscriminator(orderId?: string): {discriminator: string} {
        return {
            discriminator: `Tasty.${this.tastyOrderRawData.accountNumber}.${orderId ?? this.tastyOrderRawData.id.toString()}`
        }
    }

    private _getNumberOfReplaceAttemptsFromStorage(orderId?: string): NullableUndefinedString {
        return this.services.localStorage.getItem(AppLocalStorageKeys.orderReplaceAttemptCount, this._getLocalStorageDiscriminator(orderId)) as NullableString;
    }

    private _replaceStorageKey() {
        if(Check.isNullOrUndefined(this.tastyOrderRawData.replacesOrderId)) {
            return;
        }

        const storedValue = this._getNumberOfReplaceAttemptsFromStorage(this.tastyOrderRawData.replacesOrderId.toString());
        if(Check.isNullOrUndefined(storedValue)) {
            return;
        }

        const numberOfAttempts = parseInt(storedValue);
        if(!Check.isNumber(numberOfAttempts)) {
            return;
        }

        this.services.localStorage.removeItem(AppLocalStorageKeys.orderReplaceAttemptCount,
                                              this._getLocalStorageDiscriminator(this.tastyOrderRawData.replacesOrderId.toString()));

        this.numberOfReplaceAttempts = numberOfAttempts;
    }

}