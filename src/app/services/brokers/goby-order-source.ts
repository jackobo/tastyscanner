import {Check} from "../../../framework/utils/type-checking";


const GOBY_ORDERS_SOURCE_NAME = "goby";
const CURRENT_GOBY_VERSION = 1;

interface ICreateInitialGobySourceOptions {
    autoReplaceEnabled: boolean;
}

export class GobyOrderSource {
    private constructor(public readonly version: number,
                        readonly autoReplaceAttempts: number,
                        readonly autoReplaceEnabled: boolean,
                        readonly autoReplacePaused: boolean) {
    }

    static createInitial(options?: ICreateInitialGobySourceOptions): GobyOrderSource {
        return new GobyOrderSource(CURRENT_GOBY_VERSION, 0, options?.autoReplaceEnabled ?? true, false);
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
        const autoReplaceAttempts: number =  (Check.isEmpty(parts[2]) ? 0 : parseInt(parts[2]));
        const autoReplaceEnabled: boolean =  parts[3] === '1';
        const autoReplacePaused: boolean =  parts[4] === '1';

        return new GobyOrderSource(version, autoReplaceAttempts, autoReplaceEnabled, autoReplacePaused);
    }

    withAutoReplaceAttempts(count: number): GobyOrderSource {
        return new GobyOrderSource(this.version, count, this.autoReplaceEnabled, this.autoReplacePaused);
    }

    withAutoReplaceEnabled(enabled: boolean): GobyOrderSource {
        return new GobyOrderSource(this.version, this.autoReplaceAttempts, enabled, this.autoReplacePaused);
    }

    withAutoReplacePaused(paused: boolean): GobyOrderSource {
        return new GobyOrderSource(this.version, this.autoReplaceAttempts, this.autoReplaceEnabled, paused);
    }

    toString(): string {
        const parts: string[] = [
            GOBY_ORDERS_SOURCE_NAME,
            this.version.toString(),
            this.autoReplaceAttempts.toString(),
            this.autoReplaceEnabled ? '1' : '0',
            this.autoReplacePaused ? '1' : '0'
        ];

        return parts.join("|");
    }
}