import {Check} from "../../../framework/utils/type-checking";


const GOBY_ORDERS_SOURCE_NAME = "goby";
const CURRENT_GOBY_VERSION = 1;

interface ICreateInitialGobySourceOptions {
    autoReplaceEnabled: boolean;
}

export class GobyOrderSource {
    private constructor(public readonly version: number,
                        readonly autoReplaceEnabled: boolean,
                        readonly autoReplaceAttempts: number,
                        readonly autoReplacePaused: boolean) {
    }

    static createInitial(options?: ICreateInitialGobySourceOptions): GobyOrderSource {
        return new GobyOrderSource(CURRENT_GOBY_VERSION, options?.autoReplaceEnabled ?? true, 0, false);
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
        const autoReplaceEnabled: boolean = parts[2] === '1';
        const autoReplaceAttempts: number = (Check.isEmpty(parts[3]) ? 0 : parseInt(parts[2]));
        const autoReplacePaused: boolean =  parts[4] === '1';

        return new GobyOrderSource(version, autoReplaceEnabled, autoReplaceAttempts, autoReplacePaused);
    }

    withAutoReplaceAttempts(count: number): GobyOrderSource {
        return new GobyOrderSource(this.version, this.autoReplaceEnabled, count, this.autoReplacePaused);
    }

    withAutoReplaceEnabled(enabled: boolean): GobyOrderSource {
        return new GobyOrderSource(this.version, enabled, this.autoReplaceAttempts, this.autoReplacePaused);
    }

    withAutoReplacePaused(paused: boolean): GobyOrderSource {
        return new GobyOrderSource(this.version, this.autoReplaceEnabled, this.autoReplaceAttempts, paused);
    }

    toString(): string {
        const parts: string[] = [
            GOBY_ORDERS_SOURCE_NAME,
            this.version.toString(),
            this.autoReplaceEnabled ? '1' : '0',
            this.autoReplaceAttempts.toString(),
            this.autoReplacePaused ? '1' : '0'
        ];

        return parts.join("|");
    }
}