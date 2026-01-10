export interface IBrokerAccountViewModel {
    accountNumber: string;
    sendOrder(order: IBrokerOrder): Promise<void>;
}

export interface IBrokerOrder {
    price: number;
    priceEffect: "Credit" | "Debit";
    orderType: "Limit" | "Market" | "Marketable Limit" | "Notional Market" | "Stop or Stop Limit";
    timeInForce: "Day" | "Ext" | "Ext Overnight"  | "GTC" | "GTC Ext" | "GTC Ext Overnight" | "GTD" | "IOC";
    legs: IBrokerOrderLeg[];

}

export interface IBrokerOrderLeg {
    action: "Allocate" | "Buy" | "Buy to Close" | "Buy to Open" | "Sell" | "Sell to Close" | "Sell to Open";
    instrumentType: "Cryptocurrency" | "Equity" | "Equity Offering" | "Equity Option" | "Fixed Income Security" | "Future" | "Future Option" | "Liquidity Pool";
    quantity: number;
    symbol: string;
}

export interface IBrokerAccountService {
    readonly accounts: IBrokerAccountViewModel[];
    readonly currentAccount: IBrokerAccountViewModel | null;
    setCurrentAccount(accountNumber: string): void;
}