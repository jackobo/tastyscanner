export type OrderType = "Limit" | "Market" | "Marketable Limit" | "Notional Market" | "Stop or Stop Limit"
export type PriceEffect = "Credit" | "Debit";
export type TimeInForce = "Day" | "Ext" | "Ext Overnight"  | "GTC" | "GTC Ext" | "GTC Ext Overnight" | "GTD" | "IOC";
export interface IBrokerOpenOrderRequest {
    price: number;
    priceEffect: PriceEffect;
    orderType: OrderType;
    timeInForce: TimeInForce;
    legs: IBrokerOpenOrderRequestLeg[];
}

export interface IBrokerOpenOrderRequestLeg {
    action: "Allocate" | "Buy" | "Buy to Close" | "Buy to Open" | "Sell" | "Sell to Close" | "Sell to Open";
    instrumentType: "Cryptocurrency" | "Equity" | "Equity Offering" | "Equity Option" | "Fixed Income Security" | "Future" | "Future Option" | "Liquidity Pool";
    quantity: number;
    symbol: string;
}
