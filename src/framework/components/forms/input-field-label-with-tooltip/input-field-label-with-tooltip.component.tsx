import React, {PropsWithChildren} from "react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {IFormField} from "../../../models/forms/form-field.interface";
import {IonIcon} from "@ionic/react";
import {informationCircleOutline} from "ionicons/icons";
import {TooltipComponent} from "../../tooltip/tooltip.component";
import {TooltipStandardContentBox} from "../../tooltip/tooltip-standard-content.box";

const FieldLabelContainerBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
`
const FieldLabelIconBox = styled.div`
    cursor: pointer;
`


interface InputFieldLabelWithTooltipComponentProps extends PropsWithChildren {
    field: IFormField
}

export const InputFieldLabelWithTooltipComponent: React.FC<InputFieldLabelWithTooltipComponentProps> = observer((props) => {
    const infoIconElementRef = React.useRef<HTMLDivElement | null>(null);
    return (
        <FieldLabelContainerBox>
            <span>
                {props.field.fieldName}
            </span>
            <FieldLabelIconBox ref={infoIconElementRef}>
                <IonIcon icon={informationCircleOutline}/>
            </FieldLabelIconBox>
            <TooltipComponent targetRef={infoIconElementRef}>
                <TooltipStandardContentBox>
                    {props.children}
                </TooltipStandardContentBox>
            </TooltipComponent>
        </FieldLabelContainerBox>
    )
})