import {OptionModel} from "./option.model";
import {IIronCondorViewModel} from "./iron-condor.view-model.interface";
import {IServiceFactory} from "../services/service-factory.interface";
import {IStrategySendOrderParams} from "./strategy.view-model.interface";
import {OptionsStrategyLegModel} from "./options-strategy-leg.model";

export class IronCondorModel implements IIronCondorViewModel {
    constructor(public readonly wingsWidth: number,
                public readonly btoPut: OptionModel,
                public readonly stoPut: OptionModel,
                public readonly stoCall: OptionModel,
                public readonly btoCall: OptionModel,
                private readonly services: IServiceFactory) {
    }

    get strategyName(): string {
        return "Iron Condor";
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

    get legs(): OptionsStrategyLegModel[] {
        return [
            new OptionsStrategyLegModel(this.btoPut, "BTO"),
            new OptionsStrategyLegModel(this.stoPut, "STO"),
            new OptionsStrategyLegModel(this.stoCall, "STO"),
            new OptionsStrategyLegModel(this.btoCall, "BTO"),
        ]
    }

    async sendOrder(orderParams: IStrategySendOrderParams): Promise<void> {
        const account = this.services.brokerAccount.currentAccount;
        //TODO show error
        if(!account) {
            return;
        }

        await account.sendOrder({
            price: orderParams.price ?? this.credit,
            priceEffect: "Credit",
            timeInForce: orderParams.timeInForce,
            orderType: orderParams.orderType,
            legs: [
                {
                    instrumentType: "Equity Option",
                    action: "Buy to Open",
                    quantity: orderParams.quantity,
                    symbol: this.btoPut.id
                },
                {
                    instrumentType: "Equity Option",
                    action: "Sell to Open",
                    quantity: orderParams.quantity,
                    symbol: this.stoPut.id
                },
                {
                    instrumentType: "Equity Option",
                    action: "Sell to Open",
                    quantity: orderParams.quantity,
                    symbol: this.stoCall.id
                },
                {
                    instrumentType: "Equity Option",
                    action: "Buy to Open",
                    quantity: orderParams.quantity,
                    symbol: this.btoCall.id
                }
            ]
        });
    }

}