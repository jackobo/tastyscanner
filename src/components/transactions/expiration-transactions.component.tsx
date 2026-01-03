import React, {PropsWithChildren} from "react";
import {observer} from "mobx-react";
import {IOptionsExpirationVewModel} from "../../models/options-expiration.view-model.interface";
import {IonAccordion, IonChip, IonItem, IonLabel} from "@ionic/react";
import styled from "styled-components";

const ExpirationHeaderItemBox = styled(IonItem)`
    cursor: pointer;
    
`
const ExpirationHeaderItemContentBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
    padding: 8px 16px;
`

const TransactionsCountBox = styled(IonChip)`
    --background: var(--ion-color-tertiary);
    --color: var(--ion-color-tertiary-contrast);
`

const TransactionsBoxBox = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    padding: 12px;
`



interface ExpirationTransactionsComponentProps extends PropsWithChildren {
    expiration: IOptionsExpirationVewModel;
    transactionsCount: number;
}

export const ExpirationTransactionsComponent: React.FC<ExpirationTransactionsComponentProps> = observer((props) => {
    return (
        <IonAccordion value={props.expiration.expirationDate}>

            <ExpirationHeaderItemBox slot="header" color="light">
                <ExpirationHeaderItemContentBox>
                    <TransactionsCountBox>
                        {props.transactionsCount}
                    </TransactionsCountBox>
                    <IonLabel>
                        {`${props.expiration.expirationDate} (${props.expiration.daysToExpiration} days) - ${props.expiration.expirationType}`}
                    </IonLabel>

                </ExpirationHeaderItemContentBox>
            </ExpirationHeaderItemBox>

            <TransactionsBoxBox slot="content">
                {props.children}
            </TransactionsBoxBox>

        </IonAccordion>
    )
})