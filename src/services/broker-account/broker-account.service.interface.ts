export interface IBrokerAccountViewModel {
    accountNumber: string;
}

export interface IBrokerAccountService {
    readonly accounts: IBrokerAccountViewModel[];
    readonly currentAccount: IBrokerAccountViewModel | null;
    setCurrentAccount(accountNumber: string): void;
}