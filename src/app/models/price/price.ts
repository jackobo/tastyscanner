import {PriceEffect} from "../../services/brokers/interfaces/open-order-request.interface";

export class Price {
    constructor(public readonly value: number,
                public readonly priceEffect: PriceEffect) {
    }

    public get priceEffectAbbr(): string {

        if(this.priceEffect === "Credit") {
            return "cr";
        } else {
            return "db";
        }
    }

    public equals(other: NullablePrice): boolean {
        if(!other) {
            return false;
        }
        return (
            this.value === other.value &&
            this.priceEffect === other.priceEffect
        )
    }

    public toString(): string {
        return `${this.value.toFixed(2)} ${this.priceEffectAbbr}`;
    }

    get isCredit(): boolean {
        return this.priceEffect === "Credit";
    }

    get isDebit(): boolean {
        return this.priceEffect === "Debit";
    }

    public addValue(value: number): Price {
        return Price.fromValue(this.value + value);
    }

    public subtractValue(value: number): Price {
        return Price.fromValue(this.value - value);
    }

    public addPrice(price: Price): Price {
        return Price.sum([this, price]);
    }

    public subtract(price: Price): Price {
        return Price.fromValue(this.value - price.value);
    }

    public multiply(multiplier: number): Price {
        return Price.fromValue(this.value * multiplier);
    }

    public divide(divisor: number): Price {
        return Price.fromValue(this.value / divisor);
    }

    public static fromValue(value: number): Price {
        if(value >= 0) {
            return new Price(value, "Credit");
        } else {
            return new Price(value, "Debit");
        }
    }


    public static sum(prices: Price[]) : Price {
        if(prices.length === 0) {
            return new Price(0, "Credit");
        }

        let value = 0;
        for(const price of prices) {
            if(price.priceEffect === "Debit") {
                value -= price.value;
            } else {
                value += price.value;
            }
        }

        if(value >= 0) {
            return new Price(value, "Credit");
        } else {
            return new Price(Math.abs(value), "Debit");
        }
    }
}

export type NullablePrice = Price | null;