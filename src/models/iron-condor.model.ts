import {OptionModel} from "./option.model";
import {IIronCondorViewModel} from "./iron-condor.view-model.interface";
import {IServiceFactory} from "../services/service-factory.interface";

export class IronCondorModel implements IIronCondorViewModel {
    constructor(public readonly wingsWidth: number,
                public readonly btoPut: OptionModel,
                public readonly stoPut: OptionModel,
                public readonly stoCall: OptionModel,
                public readonly btoCall: OptionModel,
                private readonly services: IServiceFactory) {
    }

    get key(): string {
        return `${this.wingsWidth}${this.btoPut.strikePrice}${this.stoPut.strikePrice}${this.stoCall.strikePrice}${this.btoCall.strikePrice}`;
    }

    get credit(): number {
        const val = this.stoPut.priceForStrategyBuilder + this.stoCall.priceForStrategyBuilder - this.btoCall.priceForStrategyBuilder - this.btoPut.priceForStrategyBuilder;
        return Math.round(val * 100) / 100;
    }

    get riskRewardRatio(): number {
        const rr = this.wingsWidth / this.credit;
        return Math.round(rr * 100) / 100;
    }

    get pop(): number {
        return 100 - Math.max(this.stoPut.delta,  this.stoCall.delta);

    }

    async sendOrder(): Promise<void> {
        const account = this.services.brokerAccount.currentAccount;
        //TODO show error
        if(!account) {
            return;
        }

        await account.sendOrder({
            price: this.credit,
            priceEffect: "Credit",
            timeInForce: "GTC",
            orderType: "Limit",
            legs: [
                {
                    instrumentType: "Equity Option",
                    action: "Buy to Open",
                    quantity: 1,
                    symbol: this.btoPut.id
                },
                {
                    instrumentType: "Equity Option",
                    action: "Sell to Open",
                    quantity: 1,
                    symbol: this.stoPut.id
                },
                {
                    instrumentType: "Equity Option",
                    action: "Sell to Open",
                    quantity: 1,
                    symbol: this.stoCall.id
                },
                {
                    instrumentType: "Equity Option",
                    action: "Buy to Open",
                    quantity: 1,
                    symbol: this.btoCall.id
                }
            ]
        });
    }

}