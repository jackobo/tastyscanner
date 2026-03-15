import {ICreditSpreadViewModel} from "./credit-spread.view-model.interface";
import {OptionModel} from "./option.model";
import {IAppServiceFactory} from "../services/app-service-factory.interface";
import {IOptionsStrategySendOrderParams} from "./options-strategy.view-model.interface";
import {OptionsStrategyLegModel} from "./options-strategy-leg.model";

export abstract class CreditSpreadModel implements ICreditSpreadViewModel {
    constructor(public readonly wingsWidth: number,
                public readonly stoOption: OptionModel,
                public readonly btoOption: OptionModel,
                protected readonly services: IAppServiceFactory) {
    }

    abstract get strategyName(): string;
    abstract get legs(): OptionsStrategyLegModel[];


    get key(): string {
        return `${this.wingsWidth}${this.stoOption.strikePrice}${this.btoOption.strikePrice}`;
    }

    get credit(): number {
        const val = this.stoOption.midPrice - this.btoOption.midPrice;
        return Math.round(val * 100) / 100;
    }

    get riskRewardRatio(): number {
        const rr = this.wingsWidth / this.credit;
        return Math.round(rr * 100) / 100;
    }

    get pop(): number {
        return 100 - this.stoOption.absoluteDeltaPercent;

    }

    get delta(): number {
        return  Math.round((this.btoOption.rawDelta - this.stoOption.rawDelta) * 10000) / 100;
    }


    get theta(): number {
        return Math.round((this.btoOption.theta - this.stoOption.theta) * 10000)/100;
    }

    getOptionTickSize(price: number): number {
        return this.stoOption.getOptionTickSize(price);
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
            enableAutoReplace: orderParams.enableAutoReplace,
            legs: [
                {
                    instrumentType: "Equity Option",
                    action: "Buy to Open",
                    quantity: orderParams.quantity,
                    symbol: this.btoOption.symbol
                },
                {
                    instrumentType: "Equity Option",
                    action: "Sell to Open",
                    quantity: orderParams.quantity,
                    symbol: this.stoOption.symbol
                }
            ]
        });
    }
}
