import {DialogResult} from "../services/dialog/dialog-enums";

export enum ValidationResultEnum {
    Success,
    Failure
}


export function validationResultToDialogResult(validationResult: ValidationResultEnum): DialogResult {
    if(validationResult === ValidationResultEnum.Success) {
        return DialogResult.Accepted;
    }

    return DialogResult.Rejected;
}
