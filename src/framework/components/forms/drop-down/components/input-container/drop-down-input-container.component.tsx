import React from "react";
import styled from "styled-components";
import {observer} from "mobx-react";
import {InputContainerComponent} from "../../../input-container/input-container.component";
import {DropDownChevronComponent} from "../indicator/drop-down-chevron.component";
import {InputContainerComponentProps} from "../../../inputs-common.props";

const InputFieldContentWrapperBox = styled.div`
    width: 100%;
    height: 100%;
    padding: 0;
`
const InputFieldContentBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
    gap: 2px;
    background: transparent;
    color: inherit;
    outline: none;
    font-size: inherit;
    font-weight: inherit;
    padding: 0;
    
`



interface DropDownInputContainerComponentProps extends InputContainerComponentProps {
    captureInputRef: (element: HTMLDivElement) => void;
    hideChevron?: boolean;
}

export const DropDownInputContainerComponent: React.FC<DropDownInputContainerComponentProps> = observer((props) => {

    const renderChevron = () => {
        if(props.hideChevron) {
            return null;
        }

        return ( <DropDownChevronComponent/>);
    }
    const renderInput = () => {
        return (
            <InputFieldContentWrapperBox ref={props.captureInputRef}>
                <InputFieldContentBox>
                    {props.renderInput(Boolean(props.errorMessage))}
                    {renderChevron()}
                </InputFieldContentBox>
            </InputFieldContentWrapperBox>

        );
    }

    return (
        <InputContainerComponent {...props} renderInput={renderInput} />
    );
});
