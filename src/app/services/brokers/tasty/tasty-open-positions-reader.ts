import TastyTradeClient from "@tastytrade/api";
import {IAppServiceFactory} from "../../app-service-factory.interface";
import {ITastyOpenPositionRawData} from "./raw-data/tasty-open-position.raw-data.interface";
import {
    ITastyAccountOrderLegFillRawData,
    ITastyAccountOrderLegRawData,
    ITastyAccountOrderRawData
} from "./raw-data/tasty-order.raw-data.interfaces";
import {Check} from "../../../../framework/utils/type-checking";

export class TastyOpenPositionsReader {
    constructor(private readonly accountNumber: string,
                private readonly tastyClient: TastyTradeClient,
                private readonly services: IAppServiceFactory) {
    }


    async read(): Promise<ITastyAccountOrderRawData[]> {
        const positionsRawData = await this._getOpenPositionsRawData();


        if(positionsRawData.length === 0) {
            return [];
        }

        const positionsGroupedBySymbol = positionsRawData.groupByKey(p => p.symbol);


        const minDate = new Date(Math.min(...positionsRawData.map(pos => pos.createdAt.getTime())));

        const ordersWithPositionLegs = (await this._getOrdersRawData(minDate))
            .map(order => {
                return {
                    ...order,
                    legs: order.legs.filter(leg => positionsGroupedBySymbol[leg.symbol]
                                            && (leg.action === "Buy to Open" || leg.action === "Sell to Open"))
                }
            })
            .filter(order => order.legs.length > 0);

        const symbolsPositionQuantity = Object.keys(positionsGroupedBySymbol).toDictionaryOfType(symbol => symbol, symbol => positionsGroupedBySymbol[symbol].sum(p => p.quantity));

        const finalOrders: ITastyAccountOrderRawData[] = [];

        for(const order of ordersWithPositionLegs) {
            const legs: ITastyAccountOrderLegRawData[] = [];
            for(const leg of order.legs) {
                const symbolPositionQuantity = symbolsPositionQuantity[leg.symbol];
                if(symbolPositionQuantity === 0) {
                    continue;
                }

                const legQuantity = Math.min(leg.quantity, symbolPositionQuantity);

                legs.push({
                    ...leg,
                    quantity: legQuantity
                })
                symbolsPositionQuantity[leg.symbol] -= legQuantity;
            }

            if(legs.length > 0) {
                finalOrders.push({
                    ...order,
                    legs
                })
            }
        }

        return finalOrders;
    }


    private async _getOpenPositionsRawData(): Promise<ITastyOpenPositionRawData[]> {
        const positionsList = await this.tastyClient.balancesAndPositionsService.getPositionsList(this.accountNumber, {
            "include-closed-positions": false
        });

        return positionsList.map(position => {
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

    private async _getOrdersRawData(minDate: Date): Promise<ITastyAccountOrderRawData[]> {
        const response: any[] = await this.tastyClient.orderService.getOrders(this.accountNumber, {
            status: ["Filled"],
            "per-page": 200,
            "include-closed-positions": false,
            "start-date": this.services.time.formatYYYY_MM_DD(minDate)
        });


        if(!Check.isArray(response)) {
            return [];
        }

        const withoutReplaceOrderId = response.filter((order: any) => !order['replaces-order-id']);

        console.log(withoutReplaceOrderId);

        return response.map((order: any) => {
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
        })
    }
}