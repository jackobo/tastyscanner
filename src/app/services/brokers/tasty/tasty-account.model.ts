import {ITastyAccountRawData} from "./raw-data/tasty-account-raw-data.interfaces";
import TastyTradeClient from "@tastytrade/api";
import {IAppServiceFactory} from "../../app-service-factory.interface";
import {IBrokerageAccountViewModel, IBrokerOrder} from "../interfaces/broker.interface";
import {
    IAccountOpenOrder,
    IAccountOpenOrderLeg,
    IAccountOpenOrderLegFill
} from "../interfaces/account-open-order.interface";
import {Check} from "../../../../framework/utils/type-checking";

export class TastyAccountModel implements IBrokerageAccountViewModel {
    constructor(private readonly accountRawData: ITastyAccountRawData,
                private readonly tastyClient: TastyTradeClient,
                private readonly services: IAppServiceFactory) {

    }

    get id(): string {
        return `${this.brokerName}-${this.accountNumber}`
    }

    get brokerName(): string {
        return "Tasty";
    }

    get accountNumber(): string {
        return this.accountRawData.accountNumber;
    }

    async balanceAndPositions(): Promise<any> {

        //return await this.tastyClient.accountStatusService.getAccountStatus(this.accountNumber);
        //return await this.tastyClient.transactionsService.getAccountTransactions(this.accountNumber);

        const positions = await this.tastyClient.balancesAndPositionsService.getPositionsList(this.accountNumber, {
            "include-closed-positions": false,
            "include-marks": true,
            "net-positions": true
        });

        return positions;

    }
    async getOpenPositions(): Promise<IAccountOpenOrder[]> {
        const response = await this.tastyClient.orderService.getOrders(this.accountNumber, {
            status: ["Filled"],
            "per-page": 100,
            "include-closed-positions": false
        });

        if(!Check.isArray(response)) {
            return [];
        }

        const mapToOrder = (data: any): IAccountOpenOrder => {
            return {
                id: data.id.toString(),
                accountNumber: data['account-number'],
                cancellable: data.cancellable,
                editable: data.editable,
                edited: data.edited,
                extClientOrderId: data['ext-client-order-id'],
                extExchangeOrderNumber: data['ext-exchange-order-number'],
                extGlobalOrderNumber: data['ext-global-order-number'],
                globalRequestId: data['global-request-id'],
                orderType: data['order-type'],
                price: data.price,
                priceEffect: data['price-effect'],
                receivedAt:  new Date(data['received-at']),
                size: data.size,
                source: data.source,
                status: data.status,
                terminalAt: new Date(data['terminal-at']),
                timeInForce: data['time-in-force'],
                underlyingInstrumentType: data['underlying-instrument-type'],
                underlyingSymbol: data['underlying-symbol'],
                updatedAt: new Date(data['updated-at']),
                legs: (data.legs ?? []).map((leg: any): IAccountOpenOrderLeg => ({
                    action: leg.action,
                    instrumentType: leg['instrument-type'],
                    quantity: leg.quantity,
                    remainingQuantity: leg['remaining-quantity'],
                    symbol: leg.symbol,
                    fills: (leg.fills ?? []).map((fill: any): IAccountOpenOrderLegFill => ({
                        destinationVenue: fill['destination-venue'],
                        fillId: fill['fill-id'],
                        fillPrice: fill['fill-price'],
                        filledAt: fill['filled-at'],
                        quantity: fill.quantity,
                    }))
                }))
            };
        };


        return response.map(mapToOrder);
    }

    async sendOrder(order: IBrokerOrder): Promise<void> {
        try {
            const orderData = {
                "order-type": order.orderType,
                "time-in-force": order.timeInForce,
                "price": order.price,
                "price-effect": order.priceEffect,
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
}