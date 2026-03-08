import {InstrumentType, OrderLegAction, PriceEffect} from "../../interfaces/open-order-request.interface";

export type TastyOrderStatus = "Received" | "Routed" | "In Flight" | "Live" | "Cancel Requested" | "Replace Requested" | "Contingent" | "Filled" | "Cancelled" | "Expired" | "Rejected" | "Removed" | "Partially Removed";


export interface ITastyAccountOrderRawData {
    id: string;
    accountNumber: string;
    cancellable: boolean;
    editable: boolean;
    edited: boolean;
    extClientOrderId: string;
    extExchangeOrderNumber: string;
    extGlobalOrderNumber: number;
    globalRequestId: string;
    orderType: string;
    price: string;
    priceEffect: PriceEffect;
    receivedAt: Date;
    size: number;
    source: string;
    status: TastyOrderStatus;
    terminalAt: Date;
    timeInForce: string;
    underlyingInstrumentType: string;
    underlyingSymbol: string;
    updatedAt: Date;
    legs: ITastyAccountOrderLegRawData[];
}


export interface ITastyAccountOrderLegRawData {
    action: OrderLegAction;
    instrumentType: InstrumentType;
    quantity: number;
    remainingQuantity: number;
    symbol: string;
    fills: ITastyAccountOrderLegFillRawData[];
}


export interface ITastyAccountOrderLegFillRawData {
    destinationVenue: string;
    fillId: string;
    fillPrice: string;
    filledAt: string;
    quantity: number;
}
