import {OptionModel} from "./option.model";
import {IIronCondorViewModel} from "./iron-condor.view-model.interface";
import {IAppServiceFactory} from "../services/app-service-factory.interface";
import {IOptionsStrategySendOrderParams} from "./options-strategy.view-model.interface";
import {OptionsStrategyLegModel} from "./options-strategy-leg.model";

export class IronCondorModel implements IIronCondorViewModel {
    constructor(public readonly wingsWidth: number,
                public readonly btoPut: OptionModel,
                public readonly stoPut: OptionModel,
                public readonly stoCall: OptionModel,
                public readonly btoCall: OptionModel,
                private readonly services: IAppServiceFactory) {
    }

    get strategyName(): string {
        return "Iron Condor";
    }

    get key(): string {
        return `${this.wingsWidth}${this.btoPut.strikePrice}${this.stoPut.strikePrice}${this.stoCall.strikePrice}${this.btoCall.strikePrice}`;
    }

    get credit(): number {
        const val = this.stoPut.midPrice + this.stoCall.midPrice - this.btoCall.midPrice - this.btoPut.midPrice;
        return Math.round(val * 100) / 100;
    }

    get riskRewardRatio(): number {
        const rr = this.wingsWidth / this.credit;
        return Math.round(rr * 100) / 100;
    }


    //https://www.tastylive.com/shows/options-jive/episodes/calculating-pop-for-various-strategies-08-23-2017#:~:text=For%20Various%20Strategies-,Aug%2023%2C%202017,look%20at%20calculating%20POP%20in:
    get pop(): number {
        const putBreakEven = this.stoPut.strikePrice - this.credit;
        const callBreakEven = this.stoCall.strikePrice + this.credit;

        const breakEvenPut = this.stoPut.strike.expiration.getStrikeBelow(putBreakEven)?.put
        const breakEvenCall = this.stoCall.strike.expiration.getStrikeAbove(callBreakEven)?.call;


        const putBreakEventDelta = breakEvenPut?.absoluteDeltaPercent ?? 0;
        const callBreakEventDelta = breakEvenCall?.absoluteDeltaPercent ?? 0;

        return 100 - (putBreakEventDelta + callBreakEventDelta);


    }

    get legs(): OptionsStrategyLegModel[] {
        return [
            new OptionsStrategyLegModel(this.btoPut, "BTO"),
            new OptionsStrategyLegModel(this.stoPut, "STO"),
            new OptionsStrategyLegModel(this.stoCall, "STO"),
            new OptionsStrategyLegModel(this.btoCall, "BTO"),
        ]
    }

    async sendOrder(orderParams: IOptionsStrategySendOrderParams): Promise<void> {
        const account = this.services.brokers.currentAccount;
        if(!account) {
            await this.services.toaster.showErrorToast({
                renderContent: () => this.services.language.translate("No brokerage account connected")
            });
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

    get delta(): number {
        return  Math.round((this.stoPut.absoluteRawDelta + this.btoCall.absoluteRawDelta - this.btoPut.absoluteRawDelta - this.stoCall.absoluteRawDelta) * 10000) / 100;
    }

    get theta(): number {
        return Math.round((this.btoPut.theta + this.btoCall.theta - this.stoPut.theta - this.stoCall.theta) * 10000) / 100;
    }

}