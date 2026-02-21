import {NullableString} from "../types/nullable-types";

export class ApiResponseModel<TData> {
    constructor(public readonly isSuccess: boolean,
                private readonly _data: TData | null | undefined,
                public readonly endpoint: string,
                private readonly errorCode: number,
                private readonly errorDescription: NullableString,
                private readonly errorDetails: any) {
    }

    get data(): TData {
        if(this.isSuccess) {
            return this._data!;
        }

        throw new Error('Cannot access data from a failed API response');
    }

    getErrorCode(): number {
        if(this.isSuccess) {
            return 0;
        }
        return this.errorCode;
    }

    getErrorDescription(): NullableString {
        if(this.isSuccess) {
            return null;
        }
        return this.errorDescription;
    }

    getErrorDetails(): any {
        if(this.isSuccess) {
            return null;
        }

        return this.errorDetails;



    }


}