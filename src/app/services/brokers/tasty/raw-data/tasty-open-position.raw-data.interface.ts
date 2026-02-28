import {InstrumentType} from "../../interfaces/open-order-request.interface";

export interface ITastyOpenPositionRawData {
    accountNumber: string;
    instrumentType: InstrumentType;
    streamerSymbol: string;
    symbol: string;
    underlyingSymbol: string;
    quantity: number;
    averageDailyMarketClosePrice: string;
    averageOpenPrice: string;
    averageYearlyMarketClosePrice: string;
    closePrice: string;
    costEffect: string;
    isFrozen: boolean;
    isSuppressed: boolean;
    multiplier: string;
    quantityDirection: string;
    restrictedQuantity: number;
    expiresAt?: Date;
    realizedDayGain: string;
    realizedDayGainDate: Date;
    realizedDayGainEffect: string;
    realizedToday: string;
    realizedTodayDate: Date;
    realizedTodayEffect: string;
    createdAt: Date;
    updatedAt: Date;
}