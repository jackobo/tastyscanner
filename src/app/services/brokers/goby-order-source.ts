import {NullableNumber} from "../../../framework/types/nullable-types";
import {Check} from "../../../framework/utils/type-checking";


const GOBY_ORDERS_SOURCE_NAME = "goby";
const CURRENT_GOBY_VERSION = 1;
export class GobyOrderSource {
    private constructor(public readonly version: number,
                        readonly replaceAttempts: NullableNumber) {
    }

    static createInitial(): GobyOrderSource {
        return new GobyOrderSource(CURRENT_GOBY_VERSION, null);
    }
    static tryParse(source: string): GobyOrderSource | null {
        if(Check.isEmpty(source)) {
           return null;
        }

        const parts = source.split("|");

        if(parts.length < 2) {
            return null;
        }

        if(parts[0] !== GOBY_ORDERS_SOURCE_NAME) {
            return null;
        }


        const version = parseInt(parts[1]);
        const replaceAttempts: NullableNumber =  (Check.isEmpty(parts[2]) ? null : parseInt(parts[2]));

        return new GobyOrderSource(version, replaceAttempts);
    }

    withReplaceAttempts(replaceAttempts: number): GobyOrderSource {
        return new GobyOrderSource(this.version, replaceAttempts);
    }

    toString(): string {
        return `${GOBY_ORDERS_SOURCE_NAME}|${this.version}|${this.replaceAttempts ?? ""}`;
    }
}