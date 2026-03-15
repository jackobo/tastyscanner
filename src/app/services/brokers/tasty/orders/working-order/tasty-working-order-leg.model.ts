import {IWorkingOrderLegViewModel} from "../../../interfaces/working-order.interfaces";
import {ITastyOrderLegRawData} from "../../raw-data/tasty-order.raw-data.interfaces";
import {IAppServiceFactory} from "../../../../app-service-factory.interface";
import {isBuyAction, isSellAction} from "../../../interfaces/open-order-request.interface";
import {IOptionViewModel} from "../../../../../models/option.view-model.interface";
import {computed, IReactionDisposer, makeObservable, reaction} from "mobx";
import {NullableUndefinedNumber} from "../../../../../../framework/types/nullable-types";
import {Check} from "../../../../../../framework/utils/type-checking";
import {MathUtils} from "../../../../../../framework/utils/math-utils";

export class TastyWorkingOrderLegModel implements IWorkingOrderLegViewModel {
    constructor(private readonly legRawData: ITastyOrderLegRawData,
                private readonly underlyingSymbol: string,
                private readonly services: IAppServiceFactory) {
        makeObservable(this, {
            option: computed
        });

        this._optionReactionDisposer= reaction(() => this.option, (opt) => {
            if(opt) {
                this.services.marketDataProvider.subscribeToStreamer([opt.streamerSymbol]);
            }
        }, {
            fireImmediately: true
        })
    }

    private readonly _optionReactionDisposer: IReactionDisposer;

    dispose(): void {
        this._optionReactionDisposer();
        if(this.option) {
            this.services.marketDataProvider.unsubscribeFromStreamer([this.option.streamerSymbol]);
        }
    }

    get key(): string {
        return this.legRawData.symbol;
    }

    get isBuy(): boolean {
        return isBuyAction(this.legRawData.action);
    }
    get isSell(): boolean {
        return isSellAction(this.legRawData.action);
    }

    get quantity(): number {
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

}