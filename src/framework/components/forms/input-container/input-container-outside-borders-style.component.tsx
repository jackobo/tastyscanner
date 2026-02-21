import React from "react";
import {observer} from "mobx-react";
import styled, {css} from "styled-components";
import {renderInputError, renderInputIcon, renderInputLabel} from "./input-container.helpers";
import {InputContainerComponentProps} from "../inputs-common.props";
import {InputClearButtonComponent} from "./input-clear-button.component";


const RootContainerBox = styled.div<{$hasError: boolean}>`
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: var(--ion-font-size-h6);
    background-color: inherit;
    color: inherit;
    width: 100%;
    
    
    ${props => props.$hasError
            ? css`
                color: var(--ion-color-danger);
            `
            : ``
    }
    
    
    
`


const ContentSectionBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    width: 100%;
`

export const InputAndIconContainerBox = styled.div<{$hasError: boolean; $isReadOnly: boolean}>`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    gap: 6px;
    width: 100%;
    //min-height: 34px;
    
    border-radius: var(--ion-border-radius);
    padding: var(--ion-space-20) var(--ion-space-16);
    border: 1px solid var(--ion-color-border);
    ${props => props.$hasError
            ? css`
            border: 1px solid var(--ion-color-danger);    
            `
            : !props.$isReadOnly && css`
                &:focus-within {
                    border-color: var(--ion-color-border-focused);
                }
        `
    }
`

const InputContainerBox = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
`

const LabelContainerBox = styled.div`
    padding-left: 4px;
    font-weight: var(--ion-font-weight-medium);
    width: 100%;
`

const ErrorContainerBox =  styled.div`
    width: 100%;
    font-size: var(--ion-font-size-body2);
    padding-left: 4px;
    position: absolute;
    bottom: 0;
    transform: translateY(100%);
`

const IconContainerBox = styled.div`
    display: flex;
    align-content: center;
    justify-content: center;
    height: 100%;
    
`



interface InputContainerOutsideBordersStyleComponentProps extends Omit<InputContainerComponentProps, 'inputStyle'> {

}

export const InputContainerOutsideBordersStyleComponent: React.FC<InputContainerOutsideBordersStyleComponentProps> = observer((props) => {
    const hasError = Boolean(props.errorMessage);
    const specificCssClasses = props.cssClassesForOutsideBordersStyle;
    const commonCssClasses = props.cssClasses;
    const isReadOnly = Boolean(props.isReadonly);
    const renderClearButton = () => {
        if(props.showClearButton) {
            return (
                <InputClearButtonComponent onClick={props.onClearButtonClick}/>
            )
        }
        return null;
    }

    return (
        <RootContainerBox ref={props.captureInputContainerRef}
                          onClick={props.onClick}
                          $hasError={hasError}
                          className={props.className}>
            <ContentSectionBox className={specificCssClasses?.contentSectionContainer}>
                {renderInputLabel(props, LabelContainerBox)}
                <InputAndIconContainerBox $hasError={hasError} className={specificCssClasses?.inputAndIconContainer} ref={props.captureInputRef} $isReadOnly={isReadOnly}>
                    {renderInputIcon(props, IconContainerBox)}
                    <InputContainerBox className={commonCssClasses?.inputContainer}>
                        {props.renderInput(hasError)}
                        {renderClearButton()}
                    </InputContainerBox>

                </InputAndIconContainerBox>
                {renderInputError(props, ErrorContainerBox)}
            </ContentSectionBox>

        </RootContainerBox>
    );
});