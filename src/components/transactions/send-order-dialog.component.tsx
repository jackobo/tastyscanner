import React from "react";
import {IStrategyViewModel} from "../../models/strategy.view-model.interface";
import {IonButton, IonModal} from "@ionic/react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {InputBaseBox} from "../input-base.box";

const ContentBox = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
`

const HeaderBox = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    width: 100%;
    padding: 16px;
`

const BodyBox = styled.div`
    display: flex;
    flex-direction: column;
    padding: 24px;
    flex-grow: 1;
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
`



interface SendOrderDialogComponentProps {
    isOpen: boolean;
    strategy: IStrategyViewModel;
    onDitDismiss: () => void;
}

export const SendOrderDialogComponent: React.FC<SendOrderDialogComponentProps> = observer((props) => {
    const [quantity, setQuantity] = React.useState<number>(1);

    const sendOrder = async () => {
        await props.strategy.sendOrder({
            quantity: quantity
        });
        props.onDitDismiss();
    }
    return (
        <IonModal isOpen={props.isOpen} onDidDismiss={props.onDitDismiss}>
            <ContentBox>
                <HeaderBox>
                    <CloseButtonBox onClick={props.onDitDismiss}>
                        Close
                    </CloseButtonBox>
                </HeaderBox>
                <BodyBox>
                    <FieldsGridBox>
                        <div>Price</div>
                        <PriceBox value={props.strategy.credit}/>
                        <div>Quantity</div>
                        <QuantityBox type={"number"} value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value)))}/>
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