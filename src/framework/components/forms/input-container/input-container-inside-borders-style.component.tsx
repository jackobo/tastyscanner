import React from "react";
import {observer} from "mobx-react";
import styled, {css} from "styled-components";
import {renderInputError, renderInputIcon, renderInputLabel} from "./input-container.helpers";
import {InputContainerComponentProps} from "../inputs-common.props";
import {InputClearButtonComponent} from "./input-clear-button.component";

const INPUT_CONTAINER_BOX_VERTICAL_SHIFT = '6px';


const RootContainerBox = styled.div<{$hasError: boolean; $isReadOnly: boolean}>`
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: inherit;
    color: inherit;
    width: 100%;
    padding: var(--ion-space-16)
             var(--ion-space-16)
             var(--ion-space-12)
             var(--ion-space-20);
    border-radius: var(--ion-border-radius);
    gap: var(--ion-space-12);
    border: 1px solid var(--ion-color-border);
    
    ${props => props.$hasError 
        ? css`
            color: var(--ion-color-danger);
            border: var(--ion-color-danger);    
        `
        : !props.$isReadOnly && css`
            &:focus-within {
                border-color: var(--ion-color-border-focused);
            }
        `
    }
`


const ContentSectionBox = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    width: 100%;
`

const InputContainerBox = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: -${INPUT_CONTAINER_BOX_VERTICAL_SHIFT};
    font-size: var(--ion-font-size-h4);
    font-weight: var(--ion-font-weight-bold);
    color: var(--ion-color-dark);
    
`


const LabelContainerBox = styled.div`
    font-size: var(--ion-font-size-caption);
    font-weight: var(--ion-font-weight-medium);
    color: var(--ion-color-medium);
    width: 100%;
`

const ErrorContainerBox =  styled.div`
    width: 100%;
    color: var(--ion-color-danger);
    font-size: var(--ion-font-size-body2);
`

const IconContainerBox = styled.div`
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    padding-bottom: ${INPUT_CONTAINER_BOX_VERTICAL_SHIFT};
    height: 100%;
    
    
`

interface InputContainerInsideBordersStyleComponentProps extends Omit<InputContainerComponentProps, 'inputStyle'> {

}

export const InputContainerInsideBordersStyleComponent: React.FC<InputContainerInsideBordersStyleComponentProps> = observer((props) => {
    const hasError = Boolean(props.errorMessage);
    const specificCssClasses = props.cssClassesForInsideBorders;
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
                           $isReadOnly={isReadOnly}
                           className={props.className}>
            {renderInputIcon(props, IconContainerBox)}

            <ContentSectionBox className={specificCssClasses?.contentSectionContainer}>
                {renderInputLabel(props, LabelContainerBox)}
                <InputContainerBox className={commonCssClasses?.inputContainer} ref={props.captureInputRef}>
                    {props.renderInput(hasError)}
                    {renderClearButton()}
                </InputContainerBox>
                {renderInputError(props, ErrorContainerBox)}
            </ContentSectionBox>

        </RootContainerBox>
    );
})