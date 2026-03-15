import React, {useEffect, useState} from "react";
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
import {TimeSpan} from "../../../../framework/types/time-span";
import {IonSpinnerComponent} from "../../../../framework/components/spinner/ion-spinner.component";

const FooterBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-top: var(--ion-space-8);
`

const AutoReplaceInfoBox = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
`


const AutoReplaceCountBox = styled.div`
`

const NextAutoReplaceTimeBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--ion-space-8);
    
`


export const WokingOrderFooterComponent: React.FC<{workingOrder: IWorkingOrderViewModel}> = observer((props) => {
    const services = useServices();
    const [paused, setPaused] = useState(props.workingOrder.autoReplacePaused);
    const [nextAutoReplaceTime, setNextAutoReplaceTime] = useState<TimeSpan | null>(props.workingOrder.timeUntilNextAutoReplace);

    useEffect(() => {
        const intervalRef = setInterval(() => {
            setNextAutoReplaceTime(props.workingOrder.timeUntilNextAutoReplace);
        }, 1000);

        return () => {
            clearInterval(intervalRef);
        }

    }, [props.workingOrder.timeUntilNextAutoReplace]);

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

    const renderNextAutoReplaceTime = () => {
        if(!nextAutoReplaceTime) {
            return null;
        }
        return (
            <NextAutoReplaceTimeBox>
                <span>
                    {services.language.translate('Next auto replace in:')}
                </span>
                {
                    nextAutoReplaceTime.totalMilliseconds === 0
                        ? <IonSpinnerComponent/>
                        : <span>{nextAutoReplaceTime.toMinutesAndSecondsString()}</span>
                }

            </NextAutoReplaceTimeBox>
        )
    }

    return (
        <FooterBox>
            <AutoReplaceInfoBox>
                <AutoReplaceCountBox>
                    {services.language.translationFor('Auto replace: {xOfy} attempts')
                        .withParams({xOfy: `${currentAutoReplaceAttempt}/${maxAutoReplaceAttempts}`})}
                </AutoReplaceCountBox>
                {renderNextAutoReplaceTime()}
            </AutoReplaceInfoBox>

            <SpecializedButtonComponent renderIcon={renderPauseResumeIcon} onClick={onPauseResumeClick} tooltipText={renderToolTipText()}/>

        </FooterBox>
    )
})