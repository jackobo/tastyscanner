import {IActivePositionLegViewModel,
    IActivePositionViewModel
} from "../interfaces/active-position.interfaces";
import {IAppServiceFactory} from "../../app-service-factory.interface";
import {
    ITastyLegConsolidatedWithPosition,
    ITastyOrderConsolidatedWithPositions
} from "./raw-data/tasty-order-consoliddate-with-positions.raw-data.interface";
import {isBuyToOpenAction, isSellToOpenAction} from "../interfaces/open-order-request.interface";
import {NullableDate, NullableNumber} from "../../../../framework/types/nullable-types";
import {Check} from "../../../../framework/utils/type-checking";
import {IQuoteRawData, ITradeRawData} from "../../market-data-provider/market-data-provider.service.interface";
import {OptionType} from "../../../models/option.view-model.interface";

export class TastyActivePositionModel implements IActivePositionViewModel {
    constructor(private readonly services: IAppServiceFactory,
                private readonly orderRawData: ITastyOrderConsolidatedWithPositions) {
        this.legs = orderRawData.legs.map(leg => new TastyActivePositionLegModel(services, leg))
                                     .sort((l1, l2) => (l1.strikePrice ?? 0) - (l2.strikePrice ?? 0));
    }

    get id(): string {
        return this.orderRawData.id.toString();
    }
    get underlyingSymbol(): string {
        return this.orderRawData.underlyingSymbol;
    }
    get createdAt(): Date {
        return this.orderRawData.terminalAt;
    }

    private _sumValues(values: number[]): number {
        return Math.round(values.sum(val => val) * 100)/100;
    }

    get profitLossPercent(): number {
        return 100 * (this.profitLoss / Math.abs(this.tradingCost));
    }

    get profitLoss(): number {
        return this._sumValues(this.legs.map(leg => leg.profitLoss));
    }

    get marketPrice(): number {
        return this._sumValues(this.legs.map(leg => leg.marketPrice));
    }
    get tradingPrice(): number {
        return this._sumValues(this.legs.map(leg => leg.tradingPrice));
    }

    get tradingCost(): number {
        return this._sumValues(this.legs.map(leg => leg.tradingCost));
    }



    get daysToExpiration(): NullableNumber {
        const daysToExpiration =  this.legs.filter(l => !Check.isNullOrUndefined(l.daysToExpiration))
            .map(l => l.daysToExpiration ?? 0);
        if(daysToExpiration.length === 0) {
            return null;
        }
        return Math.min(...daysToExpiration);
    }



    public readonly legs: TastyActivePositionLegModel[];

    getAllStreamerSymbols(): string[] {
        return this.legs.map(leg => leg.streamerSymbol);
    }
}

export class TastyActivePositionLegModel implements IActivePositionLegViewModel {
    constructor(private readonly services: IAppServiceFactory,
                private readonly legRawData: ITastyLegConsolidatedWithPosition) {

        if(legRawData.position.instrumentType === "Equity Option"
            || legRawData.position.instrumentType === "Future Option") {
            this._parsedOptionStreamerSymbol = parseOptionStreamerSymbol(legRawData.position.streamerSymbol);
        }

    }

    private _parsedOptionStreamerSymbol: IParsedOptionStreamerSymbol | null = null;

    get symbol(): string {
        return this.legRawData.leg.symbol;
    }

    get streamerSymbol(): string {
        return this.legRawData.position.streamerSymbol;
    }

    get rawQuantity(): number {
        return this.legRawData.leg.quantity;
    }

    get quantity(): number {
        if(this.isSell) {
            return -1 * this.rawQuantity;
        }
        return this.rawQuantity;
    }

    get multiplier(): number {
        return parseInt(this.legRawData.position.multiplier);
    }

    get instrumentType(): string {
        return this.legRawData.leg.instrumentType;
    }

    get rawMarketPrice(): number {
        return  this.trade?.price ?? 0
    }

    get marketPrice(): number {

        if(this.isSell) {
            return -1 * this.rawMarketPrice;
        }

        return this.rawMarketPrice;
    }

    get rawMarketCost(): number {
        return this.rawMarketPrice * this.rawQuantity * this.multiplier;
    }

    get marketCost(): number {
        return this.marketPrice * this.rawQuantity * this.multiplier;
    }

    get rawTradingPrice(): number {
        return this.legRawData.leg.fills.sum(fill => parseFloat(fill.fillPrice));
    }

    get tradingPrice(): number {
        if(this.isSell) {
            return this.rawTradingPrice;
        }
        return -1 * this.rawTradingPrice;
    }

    get rawTradingCost(): number {
        return this.rawTradingPrice * this.rawQuantity * this.multiplier;
    }

    get tradingCost(): number {
        return this.tradingPrice * this.rawQuantity * this.multiplier;
    }

    get profitLoss(): number {
        if(this.isSell) {
            return this.rawTradingCost - this.rawMarketCost;
        } else {
            return this.rawMarketCost - this.rawTradingCost;
        }

    }

    get profitLossPercent(): number {
        return 100 * (this.profitLoss / this.rawTradingCost);
    }


    get isSell(): boolean {
        return isSellToOpenAction(this.legRawData.leg.action);
    }

    get isBuy(): boolean {
        return isBuyToOpenAction(this.legRawData.leg.action);
    }

    get optionType(): OptionType | null {
        return this._parsedOptionStreamerSymbol?.optionType ?? null;
    }

    get expirationDate(): NullableDate {
        return this._parsedOptionStreamerSymbol?.expirationDate ?? null;
    }
    get strikePrice(): NullableNumber {
        return this._parsedOptionStreamerSymbol?.strikePrice ?? null;
    }

    get daysToExpiration(): NullableNumber {
        if(!this.expirationDate) {
            return null;
        }
        return this.services.time.differenceInCalendarDays(this.services.time.currentDate, this.expirationDate);
    }

    private get trade(): ITradeRawData | undefined {
        return this.services.marketDataProvider.getSymbolTrade(this.streamerSymbol);
    }
    private get quote(): IQuoteRawData | undefined {
        return this.services.marketDataProvider.getSymbolQuote(this.streamerSymbol);
    }


    get bidPrice(): NullableNumber {
        return this.quote?.bidPrice ?? null;
    }
    get askPrice(): NullableNumber {
        return this.quote?.askPrice ?? null;
    }
}

interface IParsedOptionStreamerSymbol {
    underlyingSymbol: string;
    expirationDate: Date;
    optionType: OptionType;
    strikePrice: number;
}

const regex = /^\.(?<underlying>[A-Z]+)(?<expiration>\d{6})(?<type>[CP])(?<strike>\d+(\.\d+)?)$/;

function parseOptionStreamerSymbol(optionSymbol: string): IParsedOptionStreamerSymbol | null {
    const match = optionSymbol.match(regex);

    if (!match || !match.groups) {
        // Return null if the format is invalid
        return null;
    }

    const { underlying, expiration, type, strike } = match.groups;

    // Parse expiration date: YYMMDD to Date
    const year = 2000 + parseInt(expiration.substring(0, 2));
    const month = parseInt(expiration.substring(2, 4)) - 1;
    const day = parseInt(expiration.substring(4, 6));

    const expirationDate = new Date(year, month, day);

    // Return the parsed fields
    return {
        underlyingSymbol: underlying,
        expirationDate,
        optionType: type as OptionType,
        strikePrice: parseFloat(strike), // Strike poate avea zecimale, deci folosim parseFloat
    };
}