import React, {PropsWithChildren, useRef} from "react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {
    TooltipComponent,
    TooltipToggleBehaviorEnum
} from "../../../../../framework/components/tooltip/tooltip.component";
import {IonIcon} from "@ionic/react";
import {informationCircleOutline} from "ionicons/icons";

export const FilterLabelBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--ion-space-8);
`

const TooltipContentBox = styled.div`
    padding: var(--ion-space-12);
    font-size: var(--ion-font-size-caption);
    max-width: 250px;
    line-height: 1.3;
`

const InfoIconBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    color: var(--ion-color-primary);
    font-size: var(--ion-font-size-body1);
    cursor: pointer;
`

interface FilterLabelComponentProps extends PropsWithChildren {
    tooltip?: string | React.ReactElement;
    className?: string;
}

export const FilterLabelComponent: React.FC<FilterLabelComponentProps> = observer((props) => {
    const filterIconBoxRef = useRef<HTMLDivElement | null>(null)
    const renderInfoIcon = () => {
        if(props.tooltip) {
            return (
                <InfoIconBox ref={filterIconBoxRef}>
                    <IonIcon icon={informationCircleOutline}/>
                </InfoIconBox>
            )
        }
    }

    const renderTooltip = () => {
        if(!props.tooltip) {
            return null;
        }

        return (
            <TooltipComponent targetRef={filterIconBoxRef} placement={"bottom"} toggleBehavior={TooltipToggleBehaviorEnum.OnTargetMouseEnterLeave}>
                <TooltipContentBox>
                    {props.tooltip}
                </TooltipContentBox>
            </TooltipComponent>
        )
    }

    return (
        <>
            <FilterLabelBox className={props.className}>
                <div>
                    {props.children}
                </div>
                {renderInfoIcon()}

            </FilterLabelBox>
            {renderTooltip()}
        </>
    )
})