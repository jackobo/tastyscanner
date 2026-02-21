import React, {MouseEvent} from "react";
import {observer} from "mobx-react";
import {IonIcon} from "@ionic/react";
import {closeCircleOutline} from "ionicons/icons";
import styled from "styled-components";
import {useFrameworkServices} from "../../../hooks/use-framework-services.hook";

const ClearButtonBox = styled.span`
    position: absolute;
    right: 0;
    cursor: pointer;
`

interface InputClearButtonComponentProps {
    onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}
export const InputClearButtonComponent: React.FC<InputClearButtonComponentProps> = observer((props) => {
    const services = useFrameworkServices();
    const label = services.language.translate('Clear');
    return (
        <ClearButtonBox onClick={props.onClick} title={label}>
            <IonIcon icon={closeCircleOutline}/>
        </ClearButtonBox>
    )
})