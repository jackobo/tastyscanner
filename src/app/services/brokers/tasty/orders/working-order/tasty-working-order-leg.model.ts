import {IWorkingOrderLegViewModel} from "../../../interfaces/working-order.interfaces";
import {ITastyOrderLegRawData} from "../../raw-data/tasty-order.raw-data.interfaces";
import {IAppServiceFactory} from "../../../../app-service-factory.interface";
import {isBuyAction, isSellAction, OrderSimpleLegActionType} from "../../../interfaces/open-order-request.interface";
import {IOptionViewModel, OptionType} from "../../../../../models/option.view-model.interface";
import {computed, IReactionDisposer, makeObservable, reaction} from "mobx";
import {
    NullableDate,
    NullableNumber,
    NullableUndefinedNumber
} from "../../../../../../framework/types/nullable-types";
import {Check} from "../../../../../../framework/utils/type-checking";
import {MathUtils} from "../../../../../../framework/utils/math-utils";

export class TastyWorkingOrderLegModel implements IWorkingOrderLegViewModel {
    constructor(private readonly legRawData: ITastyOrderLegRawData,
                private readonly underlyingSymbol: string,
                private readonly services: IAppServiceFactory) {
        makeObservable(this, {
            option: computed
        });

        this._optionReactionDisposer = reaction(() => this.option, (opt) => {
            opt?.subscribeToStreamer();
        }, {
            fireImmediately: true
        })
    }




    private readonly _optionReactionDisposer: IReactionDisposer;

    dispose(): void {
        this._optionReactionDisposer();
        this.option?.unsubscribeFromStreamer();
    }

    get key(): string {
        return this.legRawData.symbol;
    }

    get symbol(): string {
        return this.legRawData.symbol;
    }

    get isBuy(): boolean {
        return isBuyAction(this.legRawData.action);
    }
    get isSell(): boolean {
        return isSellAction(this.legRawData.action);
    }

    get actionType(): OrderSimpleLegActionType | null {
        switch (this.legRawData.action) {
            case "Sell to Open":
                return 'STO';
            case "Buy to Open":
                return 'BTO';
            case "Sell to Close":
                return 'STC';
            case "Buy to Close":
                return 'BTC';
            default:
                return null;

        }
    }

    get rawQuantity(): number {
        return this.legRawData.quantity;
    }

    get quantity(): number {
        if(this.isSell) {
            return -1 * this.legRawData.quantity;
        }
        return this.legRawData.quantity;
    }

    get option(): IOptionViewModel | null {

        if(this.legRawData.instrumentType === "Equity Option") {
            return this.services.tickers.getTicker(this.underlyingSymbol).getOptionBySymbol(this.legRawData.symbol);
        }
        return null;
    }

    get midPrice(): NullableUndefinedNumber {
        let mdp = this.option?.midPrice;
        if(Check.isNullOrUndefined(mdp)) {
            return mdp;
        }

        mdp = MathUtils.round(mdp);

        if(this.isSell) {
            return mdp;
        }

        return -1 * mdp;
    }

    get expirationDate(): NullableDate {
        return this.option?.expirationDate ?? null;
    }
    get daysToExpiration(): NullableNumber {
        return this.option?.daysToExpiration ?? null;
    }
    get strikePrice(): NullableNumber {
        return this.option?.strikePrice ?? null;
    }
    get optionType(): OptionType | null {
        return this.option?.optionType ?? null;
    }
}