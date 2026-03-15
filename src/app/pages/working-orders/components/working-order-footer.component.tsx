import React, {useState} from "react";
import {IWorkingOrderViewModel} from "../../../services/brokers/interfaces/working-order.interfaces";
import {observer} from "mobx-react";
import styled from "styled-components";
import {
    SpecializedButtonComponent
} from "../../../../framework/components/specialized-buttons/specialized-button.component";
import {IonIcon} from "@ionic/react";
import {pauseCircleOutline, playCircleOutline} from "ionicons/icons";
import {useServices} from "../../../hooks/use-services.hook";
import {Check} from "../../../../framework/utils/type-checking";

const FooterBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-top: var(--ion-space-8);
`

const AutoReplaceCountBox = styled.div`
    flex-grow: 1;
`



export const WokingOrderFooterComponent: React.FC<{workingOrder: IWorkingOrderViewModel}> = observer((props) => {
    const services = useServices();
    const [paused, setPaused] = useState(props.workingOrder.autoReplacePaused);

    if(!props.workingOrder.isGobyOrder) {
        return null;
    }

    const maxAutoReplaceAttempts = props.workingOrder.maxAutoReplaceAttempts;
    const currentAutoReplaceAttempt = props.workingOrder.numberOfAutoReplaceAttempts;

    if(Check.isNullOrUndefined(maxAutoReplaceAttempts)) {
        return null;
    }

    const renderPauseResumeIcon = () => {
        if(paused) {
            return (
                <IonIcon icon={playCircleOutline} />
            );
        }
        return (
            <IonIcon icon={pauseCircleOutline} />
        );
    }

    const onPauseResumeClick = () => {
        props.workingOrder.autoReplacePaused = !paused;
        setPaused(props.workingOrder.autoReplacePaused);
    }

    const renderToolTipText = () =>  {
        if(paused) {
            return services.language.translate('Resume auto replace');
        } else {
            return services.language.translate('Pause auto replace');
        }
    }

    return (
        <FooterBox>
            <AutoReplaceCountBox>
                {services.language.translationFor('Auto replace {xOfy} attempts')
                    .withParams({xOfy: `${currentAutoReplaceAttempt}/${maxAutoReplaceAttempts}`})}
            </AutoReplaceCountBox>
            <SpecializedButtonComponent renderIcon={renderPauseResumeIcon} onClick={onPauseResumeClick} tooltipText={renderToolTipText()}/>

        </FooterBox>
    )
})