import React, {useEffect, useRef, useState} from "react";
import {IWorkingOrderViewModel} from "../../../services/brokers/interfaces/working-order.interfaces";
import {observer} from "mobx-react";
import styled from "styled-components";
import {IonIcon} from "@ionic/react";
import {pauseCircleOutline, playCircleOutline} from "ionicons/icons";
import {useServices} from "../../../hooks/use-services.hook";
import {Check} from "../../../../framework/utils/type-checking";
import {TimeSpan} from "../../../../framework/types/time-span";
import {IonSpinnerComponent} from "../../../../framework/components/spinner/ion-spinner.component";
import {TooltipComponent, TooltipToggleBehaviorEnum} from "../../../../framework/components/tooltip/tooltip.component";

const FooterBox = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-top: var(--ion-space-8);
`

const AutoReplaceInfoBox = styled.div`
    display: flex;
    flex-direction: row;
    gap: var(--ion-space-8);
    width: 100%;
`

const AutoReplaceCountBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-grow: 1;
`

const NextAutoReplaceTimeBox = styled.div`
    
`

const PauseResumeButtonBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    justify-items: center;
    font-size: 24px;
    cursor: pointer;
    color: var(--ion-color-primary);
    border-radius: 50%;
`

const PauseResumeButtonTooltipContentBox = styled.div`
    padding: var(--ion-space-16);
    font-size: var(--ion-font-size-body2);
`


export const WokingOrderFooterComponent: React.FC<{workingOrder: IWorkingOrderViewModel}> = observer((props) => {
    const services = useServices();
    const [paused, setPaused] = useState(props.workingOrder.autoReplacePaused);
    const [nextAutoReplaceTime, setNextAutoReplaceTime] = useState<TimeSpan | null>(props.workingOrder.timeUntilNextAutoReplace);
    const pauseResumeButtonBoxRef = useRef<HTMLDivElement | null>(null);

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

    const renderPauseResumeButtonToolTipText = () =>  {
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

    const renderPauseResumeButton = () => {

        if(currentAutoReplaceAttempt >= maxAutoReplaceAttempts) {
            return null;
        }

        return (
           <>
               <PauseResumeButtonBox onClick={onPauseResumeClick} ref={pauseResumeButtonBoxRef}>
                   {renderPauseResumeIcon()}
               </PauseResumeButtonBox>
               <TooltipComponent targetRef={pauseResumeButtonBoxRef} placement={"bottom"} toggleBehavior={TooltipToggleBehaviorEnum.OnTargetMouseEnterLeave}>
                   <PauseResumeButtonTooltipContentBox>
                       {renderPauseResumeButtonToolTipText()}
                   </PauseResumeButtonTooltipContentBox>

               </TooltipComponent>
           </>
        )

    }

    return (
        <FooterBox>
            <AutoReplaceInfoBox>
                <AutoReplaceCountBox>
                    {services.language.translationFor('Auto replace: {xOfy} attempts')
                        .withParams({xOfy: `${currentAutoReplaceAttempt}/${maxAutoReplaceAttempts}`})}
                </AutoReplaceCountBox>
                {renderPauseResumeButton()}
            </AutoReplaceInfoBox>
            {renderNextAutoReplaceTime()}

        </FooterBox>
    )
})