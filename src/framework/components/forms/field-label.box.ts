import styled, {css} from "styled-components";
import {PrimaryLabelBox} from "../label/primary-label.box";


export const FieldLabelBox = styled(PrimaryLabelBox)<{$hasError: boolean}>`
    font-size: var(--ion-font-size-h5);
    font-weight: var(--ion-font-weight-bold);
    
    margin-bottom: var(--ion-space-8);
    
    ${
        props => props.$hasError 
                    ? css`
                      color: var(--ion-color-danger);
                    `
                    : ''
    }
`
