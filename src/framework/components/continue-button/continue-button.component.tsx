import React, {PropsWithChildren} from "react";
import {observer} from "mobx-react";
import styled, {css} from "styled-components";
import {PrimaryButton} from "../buttons/primary-button";
import {PrimaryButtonInverted} from "../buttons/primary-button-inverted";
import {useFrameworkServices} from "../../hooks/use-framework-services.hook";



const ContinueButton = styled(PrimaryButton)<{$inactive?: boolean}>`
    font-size: var(--ion-font-size-h4);
    ${
        props => props.fullWidth 
                ? css`` 
                : css`
                    max-width: 120px;
                `
    }
        
`

const ContinueButtonInverted = styled(PrimaryButtonInverted)<{$inactive?: boolean}>`
    font-size: var(--ion-font-size-h4);
    ${
          props => props.fullWidth
                  ? css``
                  : css`
                    max-width: 120px;
                `
    }
`


interface ContinueButtonComponentProps extends PropsWithChildren {
    onClick: () => void;
    className?: string;
    useInvertedButton?: boolean;
    fullWidth?: boolean
    inactive?: boolean;
    customButtonText?: string;
}
export const ContinueButtonComponent: React.FC<ContinueButtonComponentProps> = observer((props) => {
    const services = useFrameworkServices();
    const Button = props.useInvertedButton ? ContinueButtonInverted : ContinueButton;
    return (
        <Button onClick={props.onClick} fullWidth={props.fullWidth} className={props.className} inactive={props.inactive}>
            {props.customButtonText ?? services.language.translate('Continue')}
        </Button>
    );
});
