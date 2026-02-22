export interface IAccountOpenOrderLegFill {
    destinationVenue: string;
    fillId: string;
    fillPrice: string;
    filledAt: string;
    quantity: number;
}

export interface IAccountOpenOrderLeg {
    action: string;
    instrumentType: string;
    quantity: number;
    remainingQuantity: number;
    symbol: string;
    fills: IAccountOpenOrderLegFill[];
}

export interface IAccountOpenOrder {
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
    legs: IAccountOpenOrderLeg[];
}