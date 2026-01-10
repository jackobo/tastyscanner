import React, {PropsWithChildren} from "react";
import {observer} from "mobx-react";
import {
    IOptionsExpirationVewModel,
    OptionExpirationTypeEnum
} from "../../models/options-expiration.view-model.interface";
import {IonAccordion, IonChip, IonItem, IonLabel} from "@ionic/react";
import styled, {css} from "styled-components";

function computeHeaderColor(expirationType: OptionExpirationTypeEnum) {
    switch (expirationType) {
        case OptionExpirationTypeEnum.Regular:
            return css`
                --background: var(--ion-color-light-shade);
                --color: var(--ion-color-light-contrast);
            `;
        case OptionExpirationTypeEnum.Quarterly:
            return css`
                --background: var(--ion-color-medium-tint);
                --color: var(--ion-color-medium-contrast);
            `
        default:
            return css`
                --background: var(--ion-color-light);
                --color: var(--ion-color-light-contrast);
            `
    }
}

const ExpirationHeaderItemBox = styled(IonItem)<{ $expirationType: OptionExpirationTypeEnum}>`
    cursor: pointer;
    ${props =>computeHeaderColor(props.$expirationType)}
`
const ExpirationHeaderItemContentBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
    padding: 8px 16px;
     
`

const StrategiesCountBox = styled(IonChip)`
    --background: var(--ion-color-tertiary);
    --color: var(--ion-color-tertiary-contrast);
    min-width: 50px;
    text-align: center;
    justify-content: center;
    
`

const StrategiesBox = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    padding: 12px;
`



interface ExpirationStrategiesComponentProps extends PropsWithChildren {
    expiration: IOptionsExpirationVewModel;
    transactionsCount: number;
}

export const ExpirationStrategiesComponent: React.FC<ExpirationStrategiesComponentProps> = observer((props) => {
    return (
        <IonAccordion value={props.expiration.expirationDate}>

            <ExpirationHeaderItemBox slot="header" $expirationType={props.expiration.expirationType}>
                <ExpirationHeaderItemContentBox>
                    <StrategiesCountBox>
                        {props.transactionsCount}
                    </StrategiesCountBox>
                    <IonLabel>
                        {`${props.expiration.expirationDate} (${props.expiration.daysToExpiration} days) - ${props.expiration.expirationType}`}
                    </IonLabel>

                </ExpirationHeaderItemContentBox>
            </ExpirationHeaderItemBox>

            <StrategiesBox slot="content">
                {props.children}
            </StrategiesBox>

        </IonAccordion>
    )
})