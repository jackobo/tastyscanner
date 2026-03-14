import {ITastyAccountRawData} from "./raw-data/tasty-account.raw-data.interfaces";
import TastyTradeClient from "@tastytrade/api";
import {IAppServiceFactory} from "../../app-service-factory.interface";
import {IActivePositionsResult, IBrokerageAccountModel} from "../interfaces/brokerage-account.view-model.interface";
import {IOpenOrderRequest} from "../interfaces/open-order-request.interface";
import {TastyOrdersReader} from "./tasty-orders-reader";
import {TastyActivePositionLegModel, TastyActivePositionModel} from "./tasty-active-position.model";
import {computed, makeObservable, observable, runInAction} from "mobx";
import {TastyAccountInfoModel} from "./tasty-account-info.model";
import {ITastyOrderRawData, TASTY_WORKING_ORDER_STATUSES} from "./raw-data/tasty-order.raw-data.interfaces";
import {TastyWorkingOrderModel, WORKING_ORDERS_MAX_AUTO_REPLACE_TIME_INTERVAL} from "./tasty-working-order.model";
import {TimeSpan} from "../../../../framework/types/time-span";
import {Check} from "../../../../framework/utils/type-checking";
import {Debounce} from "../../../../framework/utils/debounce";
import {NullableUndefinedNumber, UndefinedString} from "../../../../framework/types/nullable-types";
import {AppLocalStorageKeys} from "../../storage/app-local-storage-keys";
import {GobyOrderSource} from "../goby-order-source";

class TastyActivePositionsResult implements IActivePositionsResult {
    constructor(public readonly isLoading: boolean, public readonly positions: TastyActivePositionModel[]) {
    }

}

export class TastyAccountModel implements IBrokerageAccountModel {
    constructor(private readonly accountRawData: ITastyAccountRawData,
                private readonly tastyClient: TastyTradeClient,
                public readonly services: IAppServiceFactory) {


        makeObservable<this, '_activePositions' | '_workingOrders' | 'openOrdersLegsMap' | '_accountInfo'>(this, {
            _activePositions: observable.ref,
            _workingOrders: observable,
            _accountInfo: observable.ref,
            openOrdersLegsMap: computed,
        });
    }

    private _replaceWorkingOrdersTimerRef: any;

    get id(): string {
        return `${this.brokerName}-${this.accountNumber}`
    }

    get brokerName(): string {
        return "Tasty";
    }

    get accountNumber(): string {
        return this.accountRawData.accountNumber;
    }

    private _accountInfo: TastyAccountInfoModel | null = null;
    get accountInfo(): TastyAccountInfoModel | null{
        return this._accountInfo;
    }


    async connect(): Promise<void> {
        await this._loadAccountInfo();
        await this._loadWorkingOrders();
        await this._loadActivePositions();
        this._startReplaceWorkingOrders();

    }

    async disconnect(): Promise<void> {
        const streamerSymbols = this.activePositions.positions.selectMany(o => o.getAllStreamerSymbols());
        this.services.marketDataProvider.unsubscribeFromStreamer(streamerSymbols);
        this._stopReplaceWorkingOrders();
    }



    private _activePositions: TastyActivePositionsResult = new TastyActivePositionsResult(true, []);

    private get openOrdersLegsMap(): Record<string, TastyActivePositionLegModel> {
        return this._activePositions.positions.selectMany(o => o.legs)
                                      .toDictionaryOfType(leg => leg.symbol, leg => leg);
    }

    private _setActivePositions(orders: TastyActivePositionModel[]): void {
        runInAction(() => {
            this._activePositions = new TastyActivePositionsResult(false, orders);
        });
    }

    get activePositions(): TastyActivePositionsResult {
        return this._activePositions;
    }

    private _workingOrders: TastyWorkingOrderModel[] = [];
    get workingOrders(): TastyWorkingOrderModel[] {
        return this._workingOrders;
    }


    async sendOrder(order: IOpenOrderRequest): Promise<void> {
        try {
            const orderData = {
                "order-type": order.orderType,
                "time-in-force": order.timeInForce,
                "price": order.price,
                "price-effect": order.priceEffect,
                "source": GobyOrderSource.createInitial().toString(),
                "advanced-instructions": {
                    "strict-position-effect-validation": true
                },
                "legs": order.legs.map(leg => {
                    return {
                        "action": leg.action,
                        "instrument-type": leg.instrumentType,
                        "quantity": leg.quantity,
                        "symbol": leg.symbol
                    }
                })
            }
            await this.tastyClient.orderService.createOrder(this.accountNumber, orderData);
        }
        catch (e) {
            await this.services.toaster.showErrorToast({
                renderContent: () => this.services.language.translate('Failed to place Tasty order')
            });
        }

    }

    countSoldLegs(symbol: string): number {
        const leg = this.openOrdersLegsMap[symbol];
        if(!leg?.isSell) {
            return 0;
        }

        return leg.rawQuantity;
    }

    countBoughtLegs(symbol: string): number {
        const leg = this.openOrdersLegsMap[symbol];
        if(!leg?.isBuy) {
            return 0;
        }

        return Math.abs(leg.quantity);
    }

    private async _loadAccountInfo(): Promise<void> {
        const rawAccountInfo = await this.tastyClient.balancesAndPositionsService.getAccountBalanceValues(this.accountNumber);
        runInAction(() => {
            this._accountInfo = new TastyAccountInfoModel(rawAccountInfo);
        });
    }

    private async _loadActivePositions(): Promise<void> {

        try {
            const rawActivePositions = await new TastyOrdersReader(this.accountNumber, this.tastyClient, this.services).readActivePositions();
            const openPositionsModels = rawActivePositions.map(position => new TastyActivePositionModel(this.services, position));

            const streamerSymbols = openPositionsModels.selectMany(position => position.getAllStreamerSymbols());
            this.services.marketDataProvider.subscribeToStreamer(streamerSymbols);

            this._setActivePositions(openPositionsModels);
        } catch (err) {
            this.services.logger.error('Failed to load open orders from Tasty Trade', err);
            await this.services.toaster.showErrorToast({
                renderContent: () => this.services.language.translate(`Failed to load open orders from Tasty Trade: ${err}`)
            });
            this._setActivePositions([]);
        }
    }

    private _createWorkingOrderModel(rawOrderData: ITastyOrderRawData): TastyWorkingOrderModel {
        return new TastyWorkingOrderModel(rawOrderData, this.tastyClient, this.services);
    }

    private async _loadWorkingOrders(): Promise<void> {
        try {
            const rawWorkingOrders = await new TastyOrdersReader(this.accountNumber, this.tastyClient, this.services).readWorkingOrders();
            runInAction(() => {
                this._workingOrders = rawWorkingOrders.filter(wo =>  TASTY_WORKING_ORDER_STATUSES.includes(wo.status))
                    .map(wo => this._createWorkingOrderModel(wo));
            });

            this._clearOrderReplaceAttemptStorageKeys();

        } catch (err) {
            this.services.logger.error('Failed to load working orders from Tasty Trade', err);
            await this.services.toaster.showErrorToast({
                renderContent: () => this.services.language.translate(`Failed to load working orders from Tasty Trade: ${err}`)
            });
            this._setActivePositions([]);
        }
    }


    private _orderFillDebounce: Debounce = new Debounce(TimeSpan.fromSeconds(1));

    private _tryRemoveWorkingOrder(workingOrderId: NullableUndefinedNumber): void {
        if(!workingOrderId) {
            return;
        }

        const existingWorkingOrderIndex = this._workingOrders.findIndex(wo => wo.id === workingOrderId.toString());

        if(existingWorkingOrderIndex >= 0) {
            runInAction(() => {
                this._workingOrders.splice(existingWorkingOrderIndex, 1);
            });
        }
    }

    async updateOrder(rawOrderData: ITastyOrderRawData): Promise<void> {

        this._tryRemoveWorkingOrder(rawOrderData.id);
        this._tryRemoveWorkingOrder(rawOrderData.replacesOrderId);

        if(TASTY_WORKING_ORDER_STATUSES.includes(rawOrderData.status)) {
            runInAction(() => {
                this._workingOrders.push(this._createWorkingOrderModel(rawOrderData));
            });

            let toastMessage: string = '';
            if(rawOrderData.status === "Received") {
                if(rawOrderData.replacesOrderId) {
                    toastMessage = this.services.language.translate('Order replaced');
                } else {
                    toastMessage = this.services.language.translate('Order sent');
                }

            } else if(rawOrderData.status === "Live") {
                toastMessage = this.services.language.translate('Order is live');
            }

            if(!Check.isEmpty(toastMessage)) {
                await this.services.toaster.showInfoToast({
                    renderContent: () => toastMessage,
                    autoCloseTime: TimeSpan.fromSeconds(2)
                })
            }
        } else if (rawOrderData.status === "Cancelled") {
            if(!rawOrderData.replacingOrderId) {
                //it means the order was explicitly canceled and was not canceled as a result of a replacement
                await this.services.toaster.showInfoToast({
                    renderContent: () => this.services.language.translate('Order canceled'),
                    autoCloseTime: TimeSpan.fromSeconds(2)
                })
            }

        } else if(rawOrderData.status === "Filled") {
            this._orderFillDebounce.execute(async () => {
                await this._loadActivePositions();
                await this.services.toaster.showInfoToast({
                    renderContent: () => this.services.language.translate('Order filled'),
                    autoCloseTime: TimeSpan.fromSeconds(2)
                })
            });
        } else if(rawOrderData.status === "Rejected") {
            await this.services.toaster.showErrorToast({
                renderContent: () => this.services.language.translate('Order rejected'),
                autoCloseTime: TimeSpan.fromSeconds(3)
            })
        }
    }

    /**
     * Removes storage keys for working orders that do not exist anymore
     * @private
     */
    private _clearOrderReplaceAttemptStorageKeys() {
        const storageDiscriminators = this.services.localStorage.getDiscriminators(AppLocalStorageKeys.orderAutoReplaceAttempts);
        const currentWorkingOrdersStorageDiscriminators: UndefinedString[] = this._workingOrders.filter(wo => wo.isGobyOrder)
                                                                                                .map(wo => wo.getAutoReplaceAttemptStorageDiscriminator());

        for(const storageDisc of storageDiscriminators) {
            if(!currentWorkingOrdersStorageDiscriminators.includes(storageDisc.discriminator)) {
                this.services.localStorage.removeItem(storageDisc.key, {
                    discriminator: storageDisc.discriminator,
                });
            }
        }

    }
    private _startReplaceWorkingOrders(): void {
        //this random stuff is to reduce the likelihood that multiple browser tabs to execute the order replacement at the same time
        const timeIntervalMS = Math.max(3000, Math.round(Math.random() * WORKING_ORDERS_MAX_AUTO_REPLACE_TIME_INTERVAL.totalMilliseconds));
        this._replaceWorkingOrdersTimerRef = setTimeout(async () => {
            const workingOrders = [...this.workingOrders]

            for(const workingOrder of workingOrders) {
                await workingOrder.autoReplace();
            }
            this._startReplaceWorkingOrders();

        }, timeIntervalMS);
    }


    private _stopReplaceWorkingOrders(): void {
        clearInterval(this._replaceWorkingOrdersTimerRef);
    }


    /*
    {
    "account-number": "5WZ51885",
    "available-trading-funds": "0.0",
    "bond-margin-requirement": "0.0",
    "cash-available-to-withdraw": "22216.6",
    "cash-balance": "44178.164",
    "cash-settle-balance": "22216.6",
    "closed-loop-available-balance": "22216.6",
    "cryptocurrency-margin-requirement": "0.0",
    "currency": "USD",
    "day-equity-call-value": "0.0",
    "day-trade-excess": "22216.6",
    "day-trading-buying-power": "0.0",
    "day-trading-call-value": "0.0",
    "derivative-buying-power": "13278.164",
    "equity-buying-power": "26556.328",
    "equity-offering-margin-requirement": "0.0",
    "fixed-income-security-margin-requirement": "0.0",
    "futures-margin-requirement": "0.0",
    "intraday-equities-cash-amount": "3638.614",
    "intraday-equities-cash-effect": "Debit",
    "intraday-equities-cash-effective-date": "2026-03-05",
    "intraday-futures-cash-amount": "475.98",
    "intraday-futures-cash-effect": "Debit",
    "intraday-futures-cash-effective-date": "2026-01-21",
    "long-bond-value": "0.0",
    "long-cryptocurrency-value": "0.0",
    "long-derivative-value": "58670.0",
    "long-equity-value": "0.0",
    "long-fixed-income-security-value": "0.0",
    "long-futures-derivative-value": "0.0",
    "long-futures-value": "0.0",
    "long-margineable-value": "0.0",
    "maintenance-call-value": "0.0",
    "maintenance-requirement": "30900.0",
    "margin-equity": "44178.164",
    "margin-settle-balance": "48098.6",
    "net-liquidating-value": "41409.164",
    "pending-cash": "0.0",
    "pending-cash-effect": "None",
    "previous-day-cryptocurrency-fiat-amount": "0.0",
    "previous-day-cryptocurrency-fiat-effect": "None",
    "reg-t-call-value": "0.0",
    "short-cryptocurrency-value": "0.0",
    "short-derivative-value": "61439.0",
    "short-equity-value": "0.0",
    "short-futures-derivative-value": "0.0",
    "short-futures-value": "0.0",
    "short-margineable-value": "0.0",
    "sma-equity-option-buying-power": "15683.014",
    "special-memorandum-account-apex-adjustment": "2404.85",
    "special-memorandum-account-value": "13278.16",
    "total-settle-balance": "48098.6",
    "unsettled-cryptocurrency-fiat-amount": "0.0",
    "unsettled-cryptocurrency-fiat-effect": "None",
    "used-derivative-buying-power": "28231.0",
    "snapshot-date": "2026-03-05",
    "reg-t-margin-requirement": "30900.0",
    "futures-overnight-margin-requirement": "0.0",
    "futures-intraday-margin-requirement": "0.0",
    "maintenance-excess": "13278.164",
    "pending-margin-interest": "0.0",
    "buying-power-adjustment": "0.0",
    "buying-power-adjustment-effect": "None",
    "effective-cryptocurrency-buying-power": "13278.164",
    "total-pending-liquidity-pool-rebate": "0.0",
    "long-index-derivative-value": "34735.0",
    "short-index-derivative-value": "36230.0",
    "updated-at": "2026-03-05T21:38:23.529+00:00"
}
    */

}