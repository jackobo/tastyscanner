import {SpecializedButtonComponent, SpecializedButtonComponentProps} from "./specialized-button.component";
import React, {useRef} from "react";
import {observer} from "mobx-react";
import {IonIcon} from "@ionic/react";
import {trashOutline} from "ionicons/icons";
import styled from "styled-components";
import {TooltipComponent, TooltipToggleBehaviorEnum} from "../tooltip/tooltip.component";
import {PrimaryButtonInverted} from "../buttons/primary-button-inverted";
import {useFrameworkServices} from "../../hooks/use-framework-services.hook";

const RemovePrizeToolTipConfirmationBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--ion-space-16);
    padding: var(--ion-space-8) var(--ion-space-16) var(--ion-space-16) var(--ion-space-16);
    font-size: var(--ion-font-size-body2);
`

const YesButton = styled(PrimaryButtonInverted)`
    font-size: var(--ion-font-size-caption);
    font-weight: var(--ion-font-weight-regular);
    padding: 0.5rem 0.75rem;
`

interface RemoveButtonComponentProps extends Omit<SpecializedButtonComponentProps, 'renderIcon'>{
    userConfirmation?: boolean;
}

export const RemoveButtonComponent: React.FC<RemoveButtonComponentProps> = observer((props) => {
    const services = useFrameworkServices();
    const elementRef = useRef<HTMLDivElement | null>(null)

    const useConfirmation = props.userConfirmation ?? true;

    const onYesButtonClick = () => {
        props.onClick();
    }

    const onButtonClick = () => {
        if(useConfirmation) {
            return;
        }
        props.onClick();
    }

    const renderConfirmationToolTip = () => {
        if(!useConfirmation) {
            return null;
        }
        return (
            <TooltipComponent targetRef={elementRef} placement={"bottom"} toggleBehavior={TooltipToggleBehaviorEnum.OnTargetClick} showCloseButton={true} hideArrow={true}>
                <RemovePrizeToolTipConfirmationBox>
                    <div>
                        {services.language.translate('Are you sure?')}
                    </div>
                    <YesButton onClick={onYesButtonClick}>
                        {services.language.translate('Yes')}
                    </YesButton>
                </RemovePrizeToolTipConfirmationBox>

            </TooltipComponent>
        )
    }

    return (
        <>
            <div ref={elementRef}>
                <SpecializedButtonComponent color={"danger"}
                                            {...props} onClick={onButtonClick}
                                            renderIcon={() => <IonIcon icon={trashOutline} />}/>
            </div>
            {renderConfirmationToolTip()}
        </>
)
})