export type OrderType = "Limit" | "Market" | "Marketable Limit" | "Notional Market" | "Stop or Stop Limit"
export type PriceEffect = "Credit" | "Debit";
export type TimeInForce = "Day" | "Ext" | "Ext Overnight"  | "GTC" | "GTC Ext" | "GTC Ext Overnight" | "GTD" | "IOC";
export interface IOpenOrderRequest {
    price: number;
    priceEffect: PriceEffect;
    orderType: OrderType;
    timeInForce: TimeInForce;
    enableAutoReplace: boolean;
    legs: IOpenOrderRequestLeg[];
}

export type OrderLegAction = "Allocate" | "Buy" | "Buy to Close" | "Buy to Open" | "Sell" | "Sell to Close" | "Sell to Open";

export type OrderSimpleLegActionType = 'BTO' | 'STO' | 'BTC' | 'STC';

export function isOrderLegOpenAction(action: OrderLegAction): boolean {
    return action === "Buy to Open" || action === "Sell to Open";
}

export function isSellToOpenAction(action: OrderLegAction) {
    return action === "Sell to Open";
}

export function isBuyToOpenAction(action: OrderLegAction) {
    return action === "Buy to Open";
}

export function isSellAction(action: OrderLegAction) {
    return action === "Sell" || action === "Sell to Close" || action === "Sell to Open";
}

export function isBuyAction(action: OrderLegAction) {
    return action === "Buy" || action === "Buy to Close" || action === "Buy to Open";
}

export type InstrumentType = "Cryptocurrency" | "Equity" | "Equity Offering" | "Equity Option" | "Fixed Income Security" | "Future" | "Future Option" | "Liquidity Pool";

export interface IOpenOrderRequestLeg {
    action: OrderLegAction;
    instrumentType: InstrumentType;
    quantity: number;
    symbol: string;
}
