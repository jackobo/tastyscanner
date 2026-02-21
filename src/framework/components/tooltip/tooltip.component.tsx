import React, {PropsWithChildren, useEffect, useRef, useState} from "react";
import ReactDOM from "react-dom";
import {observer} from "mobx-react";
import styled from "styled-components";
import {createPopper, Instance as PopperInstance, Placement} from "@popperjs/core";
import {isClickInsideElement} from "../../utils/is-click-inside-element";
import {
    TooltipArrowPointingDownBox,
    TooltipArrowPointingLeftBox,
    TooltipArrowPointingRightBox,
    TooltipArrowPointingUpBox
} from "./tooltip-arrows";
import {CSS_TOOLTIP_ARROW_SIZE, CSS_VAR_TOOLTIP_BACKGROUND_COLOR, CSS_VAR_TOOLTIP_COLOR} from "./tootip-css-constants";
import {ZIndex} from "../../types/z-index";
import {CardBox} from "../card/card.box";
import {IonIcon} from "@ionic/react";
import {closeOutline} from "ionicons/icons";
import {useFrameworkServices} from "../../hooks/use-framework-services.hook";



const TooltipContainerBox = styled(CardBox)`
    position: relative;
    ${CSS_VAR_TOOLTIP_BACKGROUND_COLOR}:  var(--ion-color-light);
    ${CSS_VAR_TOOLTIP_COLOR}: var(--ion-color-light-contrast);
    display: flex;
    flex-direction: column;
    padding: 0;
    z-index: ${ZIndex.Tooltip};
  
`

const TooltipHeaderBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    padding: var(--ion-space-8) var(--ion-space-8) 0 0;
`
const TooltipXCloseButtonBox = styled.div`
    cursor: pointer;
    font-size: 18px;
`

const TooltipBodyBox = styled.div`
    
`

interface CreatePopperOptions {
    placement: Placement;
    targetEl: HTMLElement | null;
    popperEl: HTMLElement | null;
    arrowEl: HTMLElement | null;
}

function createTooltipPopper(options: CreatePopperOptions) {
    if(!(options.targetEl && options.popperEl)) {
        return null;
    }

    let modifiers: any[];

    if(options.arrowEl) {
        modifiers =  [
            {
                name: 'offset',
                options: {
                    offset: [0, CSS_TOOLTIP_ARROW_SIZE - 1]
                }
            },
            {
                name: 'arrow',
                options: {
                    element: options.arrowEl
                }
            }
        ]
    } else {
        modifiers =  [
            {
                name: 'offset',
                options: {
                    offset: [0, -1]
                }
            }
        ]
    }

    return createPopper(options.targetEl, options.popperEl, {
        placement: options.placement,
        strategy: 'absolute',
        modifiers: modifiers
    });
}

export interface ITooltipController {
    open(): void;
    close(): void;
}

export enum TooltipToggleBehaviorEnum {
    /**
     * When the mouse enters the target element the tool tip is shown and when the mouse leaves target element
     * On mobile mouse enter occurs when the element is clicked and the tooltip is closed when user clicks somewhere outside.
     */
    OnTargetMouseEnterLeave,
    /**
     * The tooltip is shown/closed when the target element is clicked
     */
    OnTargetClick
}



interface TooltipComponentProps extends PropsWithChildren {
    targetRef: React.RefObject<HTMLElement | null>;
    placement: Placement;
    toggleBehavior: TooltipToggleBehaviorEnum;
    showCloseButton?: boolean;
    tooltipControllerRef?: React.RefObject<ITooltipController | null>;
    className?: string;
    hideArrow?: boolean;
}

export const TooltipComponent: React.FC<TooltipComponentProps> = observer((props) => {
    const services = useFrameworkServices();
    const popperContainerRef = useRef<HTMLDivElement | null>(null);
    const popperArrowRef = useRef<HTMLDivElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const tooltipControllerRef = useRef<ITooltipController>({
        open: () => {
            setIsOpen(true)
        },
        close: () => {
            setIsOpen(false)
        }
    });

    if(props.tooltipControllerRef) {
        props.tooltipControllerRef.current = tooltipControllerRef.current;
    }

    useEffect(() => {
        let popperInstance: PopperInstance | null = null;
        if(isOpen) {
            popperInstance = createTooltipPopper({
                placement: props.placement,
                targetEl: props.targetRef.current,
                popperEl: popperContainerRef.current,
                arrowEl: props.hideArrow ? null : popperArrowRef.current,
            });
        }

        return () => {
            if(popperInstance) {
                popperInstance.destroy();
            }
        };
    }, [isOpen, props.targetRef, props.placement, props.hideArrow]);

    useEffect(() => {
        const onDocumentClick = (event: MouseEvent) => {
            if(!popperContainerRef.current || !props.targetRef.current) {
                return;
            }
            if(!isClickInsideElement(event, popperContainerRef.current)
                && !isClickInsideElement(event, props.targetRef.current)) {
                tooltipControllerRef.current.close();
            }
        }
        document.addEventListener('click', onDocumentClick);

        return () => {
            document.removeEventListener('click', onDocumentClick);
        }
    }, [isOpen, props.targetRef]);

    useEffect(() => {
        const onTargetMouseEnter = () => {
            tooltipControllerRef.current.open();
        }

        const onTargetMouseLeave = () => {
            tooltipControllerRef.current.close();
        }

        const onTargetClick = () => {
            setIsOpen(!isOpen);
        }

        const targetEl = props.targetRef.current;

        if(targetEl) {
            if(props.toggleBehavior === TooltipToggleBehaviorEnum.OnTargetMouseEnterLeave) {
                targetEl.addEventListener('mouseenter', onTargetMouseEnter);
                targetEl.addEventListener('mouseleave', onTargetMouseLeave);
            } else {
                targetEl.addEventListener('click', onTargetClick);
            }
        }



        return () => {
            if(targetEl) {
                if(props.toggleBehavior === TooltipToggleBehaviorEnum.OnTargetMouseEnterLeave) {
                    targetEl.removeEventListener('mouseenter', onTargetMouseEnter);
                    targetEl.removeEventListener('mouseleave', onTargetMouseLeave);
                } else {
                    targetEl.removeEventListener('click', onTargetClick);
                }
            }


        }

    }, [isOpen, props.targetRef, props.toggleBehavior]);

    if(!isOpen) {
        return null;
    }

    const onClose = () => {
        tooltipControllerRef.current.close();
    }

    const renderHeader = () => {
        if(!props.showCloseButton) {
            return null;
        }

        return (
            <TooltipHeaderBox>
                <TooltipXCloseButtonBox onClick={onClose}>
                    <IonIcon icon={closeOutline}/>
                </TooltipXCloseButtonBox>
            </TooltipHeaderBox>
        );
    }


    const renderArrow = () => {
        if(props.hideArrow) {
            return null;
        }

        switch (props.placement) {
            case 'top':
            case 'top-start':
            case 'top-end':
                return <TooltipArrowPointingDownBox ref={popperArrowRef}/>;
            case 'bottom':
            case 'bottom-start':
            case 'bottom-end':
                return <TooltipArrowPointingUpBox ref={popperArrowRef}/>;
            case 'left':
            case 'left-start':
            case 'left-end':
                return <TooltipArrowPointingRightBox ref={popperArrowRef}/>;
            case 'right':
            case 'right-start':
            case 'right-end':
                return <TooltipArrowPointingLeftBox ref={popperArrowRef}/>;
            default:
                return null
        }
    }


    return ReactDOM.createPortal(
        <TooltipContainerBox ref={popperContainerRef} className={props.className}>
            {renderArrow()}
            {renderHeader()}
            <TooltipBodyBox>
                {props.children}
            </TooltipBodyBox>
        </TooltipContainerBox>
    , services.document.body)
})