import React, {useCallback, useEffect, useRef} from 'react';
import ReactDOM from 'react-dom';
import {observer} from "mobx-react";
import {DropDownPopperModel} from "./drop-down-popper.model";
import styled from "styled-components";
import {IDropDownController} from "../../models/drop-down-controller.interface";
import {IDropDownPopperOptions} from "./drop-down-popper-options";
import {ZIndex} from "../../../../../types/z-index";
import {isClickInsideElement} from "../../../../../utils/is-click-inside-element";
import {useFrameworkServices} from "../../../../../hooks/use-framework-services.hook";

const DropDownContainerBox = styled.div<{$shouldDisplay: boolean}>`
    overflow: hidden;
    display: block;
    visibility: ${props => props.$shouldDisplay ? "visible" : "hidden"};
    background-color: var(--ion-color-dark-contrast);
    font-size: var(--ion-font-size-body2);
    border: 1px solid var(--ion-color-border);
    border-radius: 0 0 var(--ion-border-radius) var(--ion-border-radius);
    border-top: 0;
    z-index: ${ZIndex.DropDownPopper};
    width: fit-content; /*This is because on drop downs that contains swiper there is a flicker when you open the drop down. The width is adjusted accordingly by the popperjs*/
    
`

interface DropDownWithPopperComponentProps {
    dropDownController: IDropDownController;
    dropDownInputElementRef: React.RefObject<HTMLElement | null>;
    renderContent: () => React.ReactElement;
    popperOptions: IDropDownPopperOptions | undefined;
}

export const DropDownWithPopperComponent: React.FC<DropDownWithPopperComponentProps> = observer((props) => {
    const services = useFrameworkServices();
    const dropDownPopperModelRef = useRef(new DropDownPopperModel(props.popperOptions));
    const dropDownContainerRef = useRef<HTMLDivElement | null>(null);



    const onDocumentClickHandler = useCallback((event: MouseEvent) => {
        if(dropDownContainerRef.current && props.dropDownInputElementRef.current) {
            if(!isClickInsideElement(event, dropDownContainerRef.current)
                && !isClickInsideElement(event, props.dropDownInputElementRef.current)) {
                //it means the user clicked outside
                props.dropDownController.closeDropDown();
            }
        }
    }, [props.dropDownController, props.dropDownInputElementRef]);

    useEffect(() => {
        const dropDownModel = dropDownPopperModelRef.current;
        const dropDownInputElement = props.dropDownInputElementRef.current;
        const dropDownContainerEl = dropDownContainerRef.current;
        if(dropDownContainerEl && dropDownInputElement && !dropDownModel.isReady) {
            dropDownModel.init(dropDownInputElement, dropDownContainerEl);
        }

        document.addEventListener('click', onDocumentClickHandler);

        return (() => {
            if(dropDownModel.isReady) {
                dropDownModel.dispose();
            }

            document.removeEventListener('click', onDocumentClickHandler);
        });
    }, [onDocumentClickHandler, props.dropDownInputElementRef]);

    return (
        ReactDOM.createPortal(
            (<DropDownContainerBox  ref={dropDownContainerRef}
                                                      $shouldDisplay={Boolean(dropDownPopperModelRef.current?.isReady)}>
            {props.renderContent()}
            </DropDownContainerBox>),
            services.document.body)

    );
});
