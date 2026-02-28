import {IAccountOpenOrderLegViewModel,
    IAccountOpenOrderViewModel
} from "../interfaces/account-open-order-interface";
import {IAppServiceFactory} from "../../app-service-factory.interface";
import {
    ITastyLegConsolidatedWithPosition,
    ITastyOrderConsolidatedWithPositions
} from "./raw-data/tasty-order-consoliddate-with-positions.raw-data.interface";
import {isSellToOpenAction} from "../interfaces/open-order-request.interface";
import {NullableDate, NullableNumber} from "../../../../framework/types/nullable-types";
import {Check} from "../../../../framework/utils/type-checking";

export class TastyOpenOrderModel implements IAccountOpenOrderViewModel {
    constructor(private readonly services: IAppServiceFactory,
                private readonly orderRawData: ITastyOrderConsolidatedWithPositions) {
        this.legs = orderRawData.legs.map(leg => new TastyOpenOrderLegModel(services, leg));
    }

    get id(): string {
        return this.orderRawData.id;
    }
    get underlyingSymbol(): string {
        return this.orderRawData.underlyingSymbol;
    }
    get createdAt(): Date {
        return this.orderRawData.terminalAt;
    }

    get tradingPrice(): number {
        return Math.round(this.legs.sum(leg => leg.tradingPrice) * 100)/100;
    }

    get daysToExpiration(): NullableNumber {
        const daysToExpiration =  this.legs.filter(l => !Check.isNullOrUndefined(l.daysToExpiration))
            .map(l => l.daysToExpiration ?? 0);
        if(daysToExpiration.length === 0) {
            return null;
        }
        return Math.min(...daysToExpiration);
    }

    public readonly legs: IAccountOpenOrderLegViewModel[];
}

export class TastyOpenOrderLegModel implements IAccountOpenOrderLegViewModel {
    constructor(private readonly services: IAppServiceFactory,
                private readonly legRawData: ITastyLegConsolidatedWithPosition) {
        this._parsedOptionStreamerSymbol = parseOptionStreamerSymbol(legRawData.position.streamerSymbol);
    }

    private _parsedOptionStreamerSymbol: IParsedOptionStreamerSymbol | null;

    get symbol(): string {
        return this.legRawData.leg.symbol;
    }
    get quantity(): number {
        if(isSellToOpenAction(this.legRawData.leg.action)) {
            return -1 * this.legRawData.leg.quantity;
        }
        return this.legRawData.leg.quantity;
    }

    get instrumentType(): string {
        return this.legRawData.leg.instrumentType;
    }
    get tradingPrice(): number {
        const fillsTotal = this.legRawData.leg.fills.sum(fill => parseFloat(fill.fillPrice))
        if(isSellToOpenAction(this.legRawData.leg.action)) {
            return fillsTotal;
        }
        return -1 * fillsTotal;
    }
    get isSell(): boolean {
        return isSellToOpenAction(this.legRawData.leg.action);
    }
    get optionType(): "P" | "C" | null {
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
}

interface IParsedOptionStreamerSymbol {
    underlyingSymbol: string;
    expirationDate: Date;
    optionType: "P" | "C";
    strikePrice: number;
}

const regex = /^\.(?<underlying>[A-Z]+)(?<expiration>\d{6})(?<type>[CP])(?<strike>\d+)$/;
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
        optionType: type as "P" | "C",
        strikePrice: parseInt(strike),
    };
}