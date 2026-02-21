import React, {PropsWithChildren, useEffect} from "react";
import ReactDOM from 'react-dom';
import {observer} from "mobx-react";
import styled from "styled-components";
import {ZIndex} from "../../../../../types/z-index";
import {IDropDownController} from "../../models/drop-down-controller.interface";
import {isClickInsideElement} from "../../../../../utils/is-click-inside-element";
import {CardBox} from "../../../../card/card.box";
import {useFrameworkServices} from "../../../../../hooks/use-framework-services.hook";


const DropDownFixedContainerBox = styled(CardBox)`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    z-index: ${ZIndex.Tooltip + 10};
    box-shadow: 0 8px 60px #0D0A2C0D, 0 -8px 60px #0D0A2C0D, 8px 0 60px #0D0A2C0D, -8px 0 60px #0D0A2C0D;
    padding: 0;
    overflow: hidden;
    border-radius: 16px;
`

interface DropDownFixedPositionComponentProps  extends  PropsWithChildren{
    dropDownController: IDropDownController;
}
export const DropDownFixedPositionComponent: React.FC<DropDownFixedPositionComponentProps> = observer((props) => {
    const services = useFrameworkServices();
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    useEffect(() => {

        const onDocumentClickHandler = (event: MouseEvent) => {
            if(containerRef.current && !isClickInsideElement(event, containerRef.current)) {
                props.dropDownController.closeDropDown();
            }
        }

        document.addEventListener('click', onDocumentClickHandler);

        return (() => {

            document.removeEventListener('click', onDocumentClickHandler);
        });
    }, [props.dropDownController]);

    return (
        ReactDOM.createPortal((<DropDownFixedContainerBox ref={containerRef} className={"tst-drop-down-fixed"}>
            {props.children}
        </DropDownFixedContainerBox>), services.document.body)
    );
});