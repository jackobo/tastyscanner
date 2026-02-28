import TastyTradeClient from "@tastytrade/api";
import {IAppServiceFactory} from "../../app-service-factory.interface";
import {ITastyOpenPositionRawData} from "./raw-data/tasty-open-position.raw-data.interface";
import {
    ITastyAccountOrderLegFillRawData,
    ITastyAccountOrderLegRawData,
    ITastyAccountOrderRawData
} from "./raw-data/tasty-order.raw-data.interfaces";
import {Check} from "../../../../framework/utils/type-checking";
import {
    ITastyLegConsolidatedWithPosition,
    ITastyOrderConsolidatedWithPositions
} from "./raw-data/tasty-order-consoliddate-with-positions.raw-data.interface";
import {isOrderLegOpenAction} from "../interfaces/open-order-request.interface";


export class TastyOpenOrdersReader {
    constructor(private readonly accountNumber: string,
                private readonly tastyClient: TastyTradeClient,
                private readonly services: IAppServiceFactory) {
    }


    async read(): Promise<ITastyOrderConsolidatedWithPositions[]> {
        const openPositions = await this._getOpenPositionsRawData();
        const openPositionsGroupedBySymbol = openPositions
            .toDictionaryOfType(position => position.symbol,
                    position => {
                            return {
                                position: position,
                                quantity: position.quantity,
                            }
                    });
        const minDate = new Date(Math.min(...openPositions.map(pos => pos.createdAt.getTime())));
        let filledOrders = await this._getFilledOrdersRawData(minDate);

        // sort orders descending by date when was created
        filledOrders = filledOrders.sort((a, b) => b.terminalAt.getTime() - a.terminalAt.getTime());


        const result: ITastyOrderConsolidatedWithPositions[] = [];

        for(const filledOrder of filledOrders) {
            const {legs, ...filledOrderWithoutLegs} = filledOrder;
            const consolidatedLegs: ITastyLegConsolidatedWithPosition[] = [];
            for(const leg of legs) {
                if(!isOrderLegOpenAction(leg.action)) {
                    continue;
                }
                const position = openPositionsGroupedBySymbol[leg.symbol];
                if(!position || position.quantity <= 0) {
                    continue;
                }
                const legQuantity = Math.min(leg.quantity, position.quantity);
                position.quantity -= legQuantity;
                consolidatedLegs.push({
                    position: position.position,
                    leg: leg
                });
            }

            if(consolidatedLegs.length > 0) {
                result.push({
                    ...filledOrderWithoutLegs,
                    legs: consolidatedLegs,
                })
            }
        }

        return result;
    }


    private async _getOpenPositionsRawData(): Promise<ITastyOpenPositionRawData[]> {
        const positionsList = await this.tastyClient.balancesAndPositionsService.getPositionsList(this.accountNumber, {
            "include-closed-positions": false
        });

        return positionsList.map((position: any) => {
            return {
                accountNumber: position["account-number"],
                instrumentType: position["instrument-type"],
                streamerSymbol: position["streamer-symbol"],
                symbol: position["symbol"],
                underlyingSymbol: position["underlying-symbol"],
                quantity: position["quantity"],
                averageDailyMarketClosePrice: position["average-daily-market-close-price"],
                averageOpenPrice: position["average-open-price"],
                averageYearlyMarketClosePrice: position["average-yearly-market-close-price"],
                closePrice: position["close-price"],
                costEffect: position["cost-effect"],
                isFrozen: position["is-frozen"],
                isSuppressed: position["is-suppressed"],
                multiplier: position["multiplier"],
                quantityDirection: position["quantity-direction"],
                restrictedQuantity: position["restricted-quantity"],
                expiresAt: new Date(position["expires-at"]),
                realizedDayGain: position["realized-day-gain"],
                realizedDayGainDate: new Date(position["realized-day-gain-date"]),
                realizedDayGainEffect: position["realized-day-gain-effect"],
                realizedToday: position["realized-today"],
                realizedTodayDate: new Date(position["realized-today-date"]),
                realizedTodayEffect: position["realized-today-effect"],
                createdAt: new Date(position["created-at"]),
                updatedAt: new Date(position["updated-at"]),
            };
        });
    }

    private async _getFilledOrdersRawData(minDate: Date): Promise<ITastyAccountOrderRawData[]> {
        const response: any[] = await this.tastyClient.orderService.getOrders(this.accountNumber, {
            status: ["Filled"],
            "per-page": 200,
            "include-closed-positions": false,
            "start-date": this.services.time.formatYYYY_MM_DD(minDate)
        });


        if(!Check.isArray(response)) {
            return [];
        }


        const mapOrder = (order: any): ITastyAccountOrderRawData => {
            return {
                id: order.id.toString(),
                accountNumber: order['account-number'],
                cancellable: order.cancellable,
                editable: order.editable,
                edited: order.edited,
                extClientOrderId: order['ext-client-order-id'],
                extExchangeOrderNumber: order['ext-exchange-order-number'],
                extGlobalOrderNumber: order['ext-global-order-number'],
                globalRequestId: order['global-request-id'],
                orderType: order['order-type'],
                price: order.price,
                priceEffect: order['price-effect'],
                receivedAt:  new Date(order['received-at']),
                size: order.size,
                source: order.source,
                status: order.status,
                terminalAt: new Date(order['terminal-at']),
                timeInForce: order['time-in-force'],
                underlyingInstrumentType: order['underlying-instrument-type'],
                underlyingSymbol: order['underlying-symbol'],
                updatedAt: new Date(order['updated-at']),
                legs: (order.legs ?? []).map((leg: any): ITastyAccountOrderLegRawData => ({
                    action: leg.action,
                    instrumentType: leg['instrument-type'],
                    quantity: leg.quantity,
                    remainingQuantity: leg['remaining-quantity'],
                    symbol: leg.symbol,
                    fills: (leg.fills ?? []).map((fill: any): ITastyAccountOrderLegFillRawData => ({
                        destinationVenue: fill['destination-venue'],
                        fillId: fill['fill-id'],
                        fillPrice: fill['fill-price'],
                        filledAt: fill['filled-at'],
                        quantity: fill.quantity,
                    }))
                }))
            };
        }

        return response.map(mapOrder);
    }
}