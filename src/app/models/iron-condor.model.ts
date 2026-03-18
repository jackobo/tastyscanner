import {OptionModel} from "./option.model";
import {IIronCondorViewModel} from "./iron-condor.view-model.interface";
import {IAppServiceFactory} from "../services/app-service-factory.interface";
import {IOptionsStrategySendOrderParams} from "./options-strategy.view-model.interface";
import {OptionsStrategyLegModel} from "./options-strategy-leg.model";
import {PutCreditSpreadModel} from "./put-credit-spread.model";
import {CallCreditSpreadModel} from "./call-credit-spread.model";
import {MathUtils} from "../../framework/utils/math-utils";


export class IronCondorModel implements IIronCondorViewModel {
    constructor(public readonly wingsWidth: number,
                private readonly putSpread: PutCreditSpreadModel,
                private readonly callSpread: CallCreditSpreadModel,
                private readonly services: IAppServiceFactory) {
        this.legs = [
            new OptionsStrategyLegModel(this.btoPut, "BTO"),
            new OptionsStrategyLegModel(this.stoPut, "STO"),
            new OptionsStrategyLegModel(this.stoCall, "STO"),
            new OptionsStrategyLegModel(this.btoCall, "BTO"),
        ];
    }



    public get btoPut(): OptionModel {
        return this.putSpread.btoOption;
    }

    public get stoPut(): OptionModel {
        return this.putSpread.stoOption;
    }
    public get stoCall(): OptionModel{
        return this.callSpread.stoOption;
    }
    public get btoCall(): OptionModel {
        return this.callSpread.btoOption;
    }

    get strategyName(): string {
        return "Iron Condor";
    }

    get key(): string {
        return `${this.wingsWidth}${this.btoPut.strikePrice}${this.stoPut.strikePrice}${this.stoCall.strikePrice}${this.btoCall.strikePrice}`;
    }

    get credit(): number {
        return this.putSpread.credit + this.callSpread.credit;
    }

    get riskRewardRatio(): number {
        return MathUtils.round(this.wingsWidth / this.credit);
    }

    getOptionTickSize(price: number): number {
        return this.stoPut.getOptionTickSize(price);
    }

    //https://www.tastylive.com/shows/options-jive/episodes/calculating-pop-for-various-strategies-08-23-2017#:~:text=For%20Various%20Strategies-,Aug%2023%2C%202017,look%20at%20calculating%20POP%20in:
    get pop(): number {
        const putBreakEvenStrikePrice = this.stoPut.strikePrice - this.credit;
        const callBreakEvenStrikePrice = this.stoCall.strikePrice + this.credit;

        const breakEvenPut = this.stoPut.strike.expiration.getStrikeBelow(putBreakEvenStrikePrice)?.put
        const breakEvenCall = this.stoCall.strike.expiration.getStrikeAbove(callBreakEvenStrikePrice)?.call;


        const putBreakEventDelta = breakEvenPut?.absoluteRawDelta ?? 0;
        const callBreakEventDelta = breakEvenCall?.absoluteRawDelta ?? 0;

        return Math.round((1 - (putBreakEventDelta + callBreakEventDelta)) * 10000)/100;


    }

    readonly legs: OptionsStrategyLegModel[];

    get hasLegsWithExistingPositions(): boolean {
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
                    symbol: this.btoPut.symbol
                },
                {
                    instrumentType: "Equity Option",
                    action: "Sell to Open",
                    quantity: orderParams.quantity,
                    symbol: this.stoPut.symbol
                },
                {
                    instrumentType: "Equity Option",
                    action: "Sell to Open",
                    quantity: orderParams.quantity,
                    symbol: this.stoCall.symbol
                },
                {
                    instrumentType: "Equity Option",
                    action: "Buy to Open",
                    quantity: orderParams.quantity,
                    symbol: this.btoCall.symbol
                }
            ]
        });
    }

    get delta(): number {
        return MathUtils.round(this.putSpread.delta + this.callSpread.delta);
    }

    get theta(): number {
        return MathUtils.round(this.putSpread.theta + this.callSpread.theta);
        //return Math.round((this.btoPut.theta + this.btoCall.theta - this.stoPut.theta - this.stoCall.theta) * 10000) / 100;
    }

    get hasLegsWithOppositePositions(): boolean {
        return this.legs.some(l => l.hasOppositePositions);
    }

}