import {IAccountOpenOrder} from "./account-open-order.interface";

export interface IBroker {
    readonly name: string;
    getAccounts(): Promise<IBrokerageAccountViewModel[]>;
}

export interface IBrokerageAccountViewModel {
    readonly id: string;
    readonly brokerName: string;
    readonly accountNumber: string;
    getOpenPositions(): Promise<IAccountOpenOrder[]>;
    balanceAndPositions(): Promise<any[]>;
    sendOrder(order: IBrokerOrder): Promise<void>;

}


export type OrderType = "Limit" | "Market" | "Marketable Limit" | "Notional Market" | "Stop or Stop Limit"
export type PriceEffect = "Credit" | "Debit";
export type TimeInForce = "Day" | "Ext" | "Ext Overnight"  | "GTC" | "GTC Ext" | "GTC Ext Overnight" | "GTD" | "IOC";
export interface IBrokerOrder {
    price: number;
    priceEffect: PriceEffect;
    orderType: OrderType;
    timeInForce: TimeInForce;
    legs: IBrokerOrderLeg[];
}

export interface IBrokerOrderLeg {
    action: "Allocate" | "Buy" | "Buy to Close" | "Buy to Open" | "Sell" | "Sell to Close" | "Sell to Open";
    instrumentType: "Cryptocurrency" | "Equity" | "Equity Offering" | "Equity Option" | "Fixed Income Security" | "Future" | "Future Option" | "Liquidity Pool";
    quantity: number;
    symbol: string;
}
