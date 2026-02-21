import React from "react";
import {IApiErrorToastHandlerViewModel} from "./api-error-toast-handler.-view-model.interface";
import {observer} from "mobx-react";
import styled from "styled-components";
import {ApiErrorFieldComponent} from "./boxes/api-error.boxes";
import {useFrameworkServices} from "../../hooks/use-framework-services.hook";

const ToastContainerBox = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    font-size: var(--ion-font-size-body2);
    gap: var(--ion-space-8);
    color: var(--ion-color-dark);
`

const DetailsButtonBox = styled.div<{$isVisible: boolean}>`
    cursor: pointer;
    width: 100%;
    text-decoration: underline;
    text-align: right;
    color: var(--ion-color-primary);
    visibility: ${props => props.$isVisible ? "visible" : "hidden"};
`

interface ApiErrorToastComponentProps {
    handler: IApiErrorToastHandlerViewModel;
}
export const ApiErrorToastComponent: React.FC<ApiErrorToastComponentProps> =  observer((props) => {
    const services = useFrameworkServices();

    const renderDetailsButton = () => {
        return (
            <DetailsButtonBox onClick={() => props.handler.showDetails()} $isVisible={!props.handler.isDialogShown}>
                {services.language.translate('Show details')}
            </DetailsButtonBox>
        );
    }

    return (
        <ToastContainerBox>
            <ApiErrorFieldComponent label={services.language.translate('Error code:')} value={props.handler.errorCode} orientation={"horizontal"}/>
            <ApiErrorFieldComponent label={services.language.translate('Description:')} value={props.handler.errorDescription}/>
            {renderDetailsButton()}
        </ToastContainerBox>
    )
})