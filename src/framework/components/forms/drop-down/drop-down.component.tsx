import React, {useRef} from 'react';
import {DropDownInputContainerComponent} from "./components/input-container/drop-down-input-container.component";
import {IDropDownController} from "./models/drop-down-controller.interface";
import {observer} from "mobx-react";
import {IDropDownDialogOptions} from "./components/dialog/drop-down-dialog-options";
import {DropDownWithPopperComponent} from "./components/popper/drop-down-with-popper.component";
import {DropDownWithDialogComponent} from "./components/dialog/drop-down-with-dialog.component";
import {IDropDownPopperOptions} from "./components/popper/drop-down-popper-options";
import {DropDownControllerModel} from "./models/drop-down-controller.model";
import {InputContainerComponentProps} from "../inputs-common.props";
import {DropDownFixedPositionComponent} from "./components/fixed/drop-down-fixed-position.component";
import {useFrameworkServices} from "../../../hooks/use-framework-services.hook";


export interface DropDownComponentProps extends Omit<InputContainerComponentProps, 'renderInput'> {
    renderDropDownInput: (controller: IDropDownController) => React.ReactElement;
    renderDropDownContent: (controller: IDropDownController) => React.ReactElement;
    dropDownContentIsInActionSheet?: boolean;
    modalDialogOptions?: IDropDownDialogOptions;
    popperOptions?: IDropDownPopperOptions;
    fixedPosition?: boolean;
    hideChevron?: boolean;
}

export const DropDownComponent: React.FC<DropDownComponentProps> = observer((props) => {
    const services = useFrameworkServices();

    const dropDownInputElementRef = useRef<HTMLDivElement | null>(null)

    const dropDownControllerRef = useRef(new DropDownControllerModel(services))


    const controller = dropDownControllerRef.current;


    const captureDropDownInputRef = (element: HTMLDivElement) => {
        dropDownInputElementRef.current = element;
    }


    const onInputClickHandler = () => {
        if(props.onClick) {
            props.onClick();
        }
        if(props.isReadonly) {
            return;
        }
        if(controller.isOpen) {
            controller.closeDropDown();
        } else {
            controller.openDropDown();
        }
    }


    const renderDropDownContent = () => {
        return props.renderDropDownContent(controller);
    }

    const renderDropDown = () => {
        if(!controller.isOpen) {
            return null;
        }

        if(props.dropDownContentIsInActionSheet) {
            return renderDropDownContent();
        }

        if(controller.isInsideModalDialog) {

            return (
                <DropDownWithDialogComponent key={`DROP_DOWN_WITH_DIALOG_${controller.isOpen}`}
                                             dropDownController={controller}
                                             renderContent={renderDropDownContent}
                                             dialogOptions={props.modalDialogOptions}
                                             renderLabel={props.renderLabel}/>
            );
        }



        if(props.fixedPosition) {
            return (
                <DropDownFixedPositionComponent dropDownController={controller}>
                    {renderDropDownContent()}
                </DropDownFixedPositionComponent>
            )
        }


        return (
            <DropDownWithPopperComponent key={`DROP_DOWN_WITH_POPPER_${controller.isOpen}`}
                                         dropDownController={controller}
                                         dropDownInputElementRef={dropDownInputElementRef}
                                         popperOptions={props.popperOptions}
                                         renderContent={renderDropDownContent}/>
        );
    }

    return (
        <>
            <DropDownInputContainerComponent {...props}
                                             hideChevron={props.hideChevron || props.isReadonly}
                                             renderInput={() => props.renderDropDownInput(controller)}
                                             onClick={onInputClickHandler}
                                             captureInputRef={captureDropDownInputRef}
                                             />
            {renderDropDown()}
        </>

    );
})
