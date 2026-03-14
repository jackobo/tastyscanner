import {InstrumentType, OrderLegAction, PriceEffect} from "../../interfaces/open-order-request.interface";

export type TastyOrderStatus = "Received" | "Routed" | "In Flight" | "Live" | "Cancel Requested" | "Replace Requested" | "Contingent" | "Filled" | "Cancelled" | "Expired" | "Rejected" | "Removed" | "Partially Removed";

export const TASTY_WORKING_ORDER_STATUSES: TastyOrderStatus[] = ["Received", "Routed", "In Flight", "Live"];

export interface ITastyOrderRawData {
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
    legs: ITastyOrderLegRawData[];
}


export interface ITastyOrderLegRawData {
    action: OrderLegAction;
    instrumentType: InstrumentType;
    quantity: number;
    remainingQuantity: number;
    symbol: string;
    fills: ITastyOrderLegFillRawData[];
}


export interface ITastyOrderLegFillRawData {
    destinationVenue: string;
    fillId: string;
    fillPrice: string;
    filledAt: string;
    quantity: number;
}
