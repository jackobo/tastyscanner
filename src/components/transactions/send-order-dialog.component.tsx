import React from "react";
import {IStrategyViewModel} from "../../models/strategy.view-model.interface";
import {IonButton, IonIcon, IonModal} from "@ionic/react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {InputBaseBox} from "../input-base.box";
import {closeOutline} from "ionicons/icons";
import {OrderType, TimeInForce} from "../../services/broker-account/broker-account.service.interface";

const ContentBox = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
`

const HeaderBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    padding: 16px;
    border-bottom: 1px solid var(--ion-color-light-shade);
`
const TitleBox = styled.div`
    flex-grow: 1;
`


const BodyBox = styled.div`
    display: flex;
    flex-direction: column;
    padding: 24px;
    flex-grow: 1;
    justify-content: center;
    justify-items: center;
    
`

const FieldsGridBox = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 16px;
`

const PriceBox = styled(InputBaseBox)`
    height: fit-content;
`

const QuantityBox = styled(InputBaseBox)`
    height: fit-content;
`


const FooterBox = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    width: 100%;
    background-color: var(--ion-color-light);
    padding: 16px;
    
`

const CloseButtonBox = styled.div`
    cursor: pointer;
    font-size: 1.5rem;
`

const FieldLabelBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`


interface SendOrderDialogComponentProps {
    isOpen: boolean;
    strategy: IStrategyViewModel;
    onDitDismiss: () => void;
}

export const SendOrderDialogComponent: React.FC<SendOrderDialogComponentProps> = observer((props) => {
    const [quantity, setQuantity] = React.useState<number>(1);
    const [orderType, setOrderType] = React.useState<OrderType>("Limit");
    const [timeInForce, setTimeInForce] = React.useState<TimeInForce>("Day");

    const sendOrder = async () => {
        await props.strategy.sendOrder({
            quantity: quantity,
            orderType: orderType,
            timeInForce: timeInForce
        });
        props.onDitDismiss();
    }
    return (
        <IonModal isOpen={props.isOpen} onDidDismiss={props.onDitDismiss}>
            <ContentBox>
                <HeaderBox>
                    <TitleBox>
                        {props.strategy.strategyName}
                    </TitleBox>
                    <CloseButtonBox onClick={props.onDitDismiss}>
                        <IonIcon icon={closeOutline}/>
                    </CloseButtonBox>
                </HeaderBox>
                <BodyBox>
                    <FieldsGridBox>
                        <FieldLabelBox>Price (readonly for the moment)</FieldLabelBox>
                        <PriceBox value={props.strategy.credit} readOnly={true}/>
                        <FieldLabelBox>Quantity</FieldLabelBox>
                        <QuantityBox type={"number"} value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value)))}/>
                        <FieldLabelBox>Order Type (readonly for the moment)</FieldLabelBox>
                        <FieldLabelBox>{orderType}</FieldLabelBox>
                        <FieldLabelBox>Time in force (readonly for the moment)</FieldLabelBox>
                        <FieldLabelBox>{timeInForce}</FieldLabelBox>
                    </FieldsGridBox>

                </BodyBox>
                <FooterBox>
                    <IonButton color={"success"} onClick={sendOrder}>
                        Send order
                    </IonButton>
                </FooterBox>
            </ContentBox>
        </IonModal>
    )
})