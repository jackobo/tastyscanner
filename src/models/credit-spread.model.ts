import {ICreditSpreadViewModel} from "./credit-spread.view-model.interface";
import {OptionModel} from "./option.model";
import {IServiceFactory} from "../services/service-factory.interface";

export abstract class CreditSpreadModel implements ICreditSpreadViewModel {
    constructor(public readonly wingsWidth: number,
                public readonly stoOption: OptionModel,
                public readonly btoOption: OptionModel,
                protected readonly services: IServiceFactory) {
    }


    get key(): string {
        return `${this.wingsWidth}${this.stoOption.strikePrice}${this.btoOption.strikePrice}`;
    }

    get credit(): number {
        const val = this.stoOption.priceForStrategyBuilder - this.btoOption.priceForStrategyBuilder;
        return Math.round(val * 100) / 100;
    }

    get riskRewardRatio(): number {
        const rr = this.wingsWidth / this.credit;
        return Math.round(rr * 100) / 100;
    }

    get pop(): number {
        return 100 - this.stoOption.delta;

    }

    async sendOrder(): Promise<void> {
        const account = this.services.brokerAccount.currentAccount;
        //TODO show error
        if(!account) {
            return;
        }

        await account.sendOrder({
            price: this.credit,
            legs: [
                {
                    instrumentType: "Equity Option",
                    action: "Buy to Open",
                    quantity: 1,
                    symbol: this.btoOption.id
                },
                {
                    instrumentType: "Equity Option",
                    action: "Sell to Open",
                    quantity: 1,
                    symbol: this.stoOption.id
                }
            ]
        });
    }


}
