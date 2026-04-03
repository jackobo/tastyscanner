import {ICreditSpreadViewModel} from "./credit-spread.view-model.interface";
import {OptionModel} from "./option.model";
import {IAppServiceFactory} from "../services/app-service-factory.interface";
import {
    IOptionsStrategyCreditsViewModel,
    IOptionsStrategySendOrderParams
} from "./options-strategy.view-model.interface";
import {OptionsStrategyLegModel} from "./options-strategy-leg.model";
import {MathUtils} from "../../framework/utils/math-utils";
import {computed, makeObservable} from "mobx";

export abstract class CreditSpreadModel implements ICreditSpreadViewModel {
    constructor(public readonly wingsWidth: number,
                public readonly stoOption: OptionModel,
                public readonly btoOption: OptionModel,
                protected readonly services: IAppServiceFactory) {
        makeObservable(this, {
            totalCredit: computed,
            riskRewardRatio: computed,
            pop: computed,
            delta: computed,
            theta: computed,
            hasLegsWithExistingPositions: computed
        })
    }

    abstract get strategyName(): string;
    abstract get legs(): OptionsStrategyLegModel[];


    get key(): string {
        return `${this.wingsWidth}${this.stoOption.strikePrice}${this.btoOption.strikePrice}`;
    }

    get totalCredit(): number {
        return MathUtils.round(this.stoOption.midPrice - this.btoOption.midPrice);
    }

    get credits(): IOptionsStrategyCreditsViewModel[] {
        return [];
    }

    get riskRewardRatio(): number {
        return MathUtils.round(this.wingsWidth / this.totalCredit);
    }

    get pop(): number {
        return  MathUtils.round((1 - this.stoOption.absoluteRawDelta) * 100);

    }

    get delta(): number {
        return  MathUtils.round((this.btoOption.rawDelta - this.stoOption.rawDelta) * 100);
    }

    get shortLegsDelta(): number {
        return this.stoOption.deltaPercent;
    }


    get theta(): number {
        return MathUtils.round((this.btoOption.theta - this.stoOption.theta) * 100);
    }

    getOptionTickSize(price: number): number {
        return this.stoOption.getOptionTickSize(price);
    }

    get hasLegsWithExistingPositions(){
        return this.legs.some(l => l.hasExistingPositions);
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
            price: orderParams.price ?? this.totalCredit,
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
