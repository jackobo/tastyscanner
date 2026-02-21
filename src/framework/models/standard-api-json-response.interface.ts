import {NullableString} from "../types/nullable-types";

export interface IStandardApiJsonResponse<T> {
  hasError: boolean;
  errorCode: number;
  errorDescription: NullableString;
  errorDetails: any;
  data: T | null | undefined;
}