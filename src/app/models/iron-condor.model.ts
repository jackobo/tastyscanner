import {OptionModel} from "./option.model";
import {IIronCondorViewModel} from "./iron-condor.view-model.interface";
import {IAppServiceFactory} from "../services/app-service-factory.interface";
import {IOptionsStrategySendOrderParams} from "./options-strategy.view-model.interface";
import {OptionsStrategyLegModel} from "./options-strategy-leg.model";
import {PutCreditSpreadModel} from "./put-credit-spread.model";
import {CallCreditSpreadModel} from "./call-credit-spread.model";
import {MathUtils} from "../../framework/utils/math-utils";
import {computed, makeObservable} from "mobx";
import {Check} from "../../framework/utils/type-checking";


export class IronCondorModel implements IIronCondorViewModel {
    constructor(public readonly wingsWidth: number,
                private readonly putSpread: PutCreditSpreadModel,
                private readonly callSpread: CallCreditSpreadModel,
                private readonly services: IAppServiceFactory) {
        this.legs = [
            ...this.putSpread.legs,
            ...this.callSpread.legs,
            /*
            new OptionsStrategyLegModel(this.btoPut, "BTO"),
            new OptionsStrategyLegModel(this.stoPut, "STO"),
            new OptionsStrategyLegModel(this.stoCall, "STO"),
            new OptionsStrategyLegModel(this.btoCall, "BTO"),
             */
        ];

        makeObservable(this, {
            credit: computed,
            riskRewardRatio: computed,
            pop: computed,
            delta: computed,
            theta: computed,
            hasLegsWithOppositePositions: computed,
            hasLegsWithExistingPositions: computed,
            shortLegsDelta: computed,
        })
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
        return `${this.wingsWidth}${this.legs.map(leg => leg.option.strikePrice).join('')}`;
    }

    get credit(): number {
        return MathUtils.round(this.putSpread.credit + this.callSpread.credit);
    }

    get riskRewardRatio(): number {
        return MathUtils.round(this.wingsWidth / this.credit);
    }

    getOptionTickSize(price: number): number {
        return this.stoPut.getOptionTickSize(price);
    }

    //https://www.tastylive.com/shows/options-jive/episodes/calculating-pop-for-various-strategies-08-23-2017#:~:text=For%20Various%20Strategies-,Aug%2023%2C%202017,look%20at%20calculating%20POP%20in:

    get pop(): number {

        //compute theoretical strike price for the sold put
        const putBreakEvenStrikePrice = this.stoPut.strikePrice - this.putSpread.credit;
        //compute theoretical strike price for the sold call
        const callBreakEvenStrikePrice = this.stoCall.strikePrice + this.callSpread.credit;

        //find the closest put exactly at or right below the theoretical strike price for the sold put
        const breakEvenPut = this.stoPut.strike.expiration.getClosestStrikeBelowOrAt(putBreakEvenStrikePrice)?.put
        //find the closest call exactly at or right above the theoretical strike price for the sold call
        const breakEvenCall = this.stoCall.strike.expiration.getClosesStrikeAboveOrAt(callBreakEvenStrikePrice)?.call;

        //get the absolute delta of the break even strike for the put
        const putBreakEventDelta = breakEvenPut?.absoluteRawDelta;
        if(Check.isNullOrUndefined(putBreakEventDelta)) {
            return 0;
        }

        //get the absolute delta of the break even strike for the call
        const callBreakEventDelta = breakEvenCall?.absoluteRawDelta;
        if(Check.isNullOrUndefined(callBreakEventDelta)) {
            return 0;
        }

        //finally, compute the POP
        return MathUtils.round((1 - putBreakEventDelta - callBreakEventDelta) * 100);

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

    get shortLegsDelta(): number {
        return MathUtils.round((this.stoPut.absoluteRawDelta - this.stoCall.absoluteRawDelta) * 100);
    }


    get theta(): number {
        return MathUtils.round(this.putSpread.theta + this.callSpread.theta);
        //return Math.round((this.btoPut.theta + this.btoCall.theta - this.stoPut.theta - this.stoCall.theta) * 10000) / 100;
    }

    get hasLegsWithOppositePositions(): boolean {
        return this.legs.some(l => l.hasOppositePositions);
    }

}