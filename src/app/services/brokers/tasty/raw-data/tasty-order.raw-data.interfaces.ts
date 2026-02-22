
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
    priceEffect: "Debut" | "Credit";
    receivedAt: Date;
    size: number;
    source: string;
    status: "Received" | "Routed" | "In Flight" | "Live" | "Cancel Requested" | "Replace Requested" | "Contingent" | "Filled" | "Cancelled" | "Expired" | "Rejected" | "Removed" | "Partially Removed";
    terminalAt: Date;
    timeInForce: string;
    underlyingInstrumentType: string;
    underlyingSymbol: string;
    updatedAt: Date;
    legs: ITastyAccountOrderLegRawData[];
}


export interface ITastyAccountOrderLegRawData {
    action: string;
    instrumentType: string;
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
