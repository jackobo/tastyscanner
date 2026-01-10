export interface IBrokerAccountViewModel {
    accountNumber: string;
    sendOrder(order: IBrokerOrder): Promise<void>;
}

export interface IBrokerOrder {
    price: number;
    legs: IBrokerOrderLeg[];

}

export interface IBrokerOrderLeg {
    action: string;
    instrumentType: string;
    quantity: number;
    symbol: string;
}

export interface IBrokerAccountService {
    readonly accounts: IBrokerAccountViewModel[];
    readonly currentAccount: IBrokerAccountViewModel | null;
    setCurrentAccount(accountNumber: string): void;
}