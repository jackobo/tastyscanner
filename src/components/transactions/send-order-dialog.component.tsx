import React from "react";
import {IStrategySendOrderParams, IStrategyViewModel} from "../../models/strategy.view-model.interface";
import {IonButton, IonIcon, IonModal} from "@ionic/react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {InputBaseBox} from "../input-base.box";
import {closeOutline, lockClosedOutline, lockOpenOutline} from "ionicons/icons";
import {OrderType, TimeInForce} from "../../services/broker-account/broker-account.service.interface";
import {NullableString} from "../../utils/nullable-types";
import {Check} from "../../utils/type-checking";
import {useServices} from "../../hooks/use-services.hook";

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

const RowSeparatorBox = styled.div`
    grid-column: 1/-1;
    width: 100%;
    height: 1px;
    background-color: var(--ion-color-light-shade);
`

const FieldsGridBox = styled.div`
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 16px;
    
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

const ReadonlyFieldValueBox = styled(FieldLabelBox)`
    padding-left: 8px;
`

const TargetPriceBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
`

const PriceLockerBox = styled.div`
    cursor: pointer;
    font-size: 1.3rem;
`

interface SendOrderDialogComponentProps {
    isOpen: boolean;
    strategy: IStrategyViewModel;
    onDitDismiss: () => void;
}

export const SendOrderDialogComponent: React.FC<SendOrderDialogComponentProps> = observer((props) => {
    const services = useServices();
    const [targetPrice, setTargetPrice] = React.useState<NullableString>(null);
    const [quantity, setQuantity] = React.useState<number>(1);
    const [orderType] = React.useState<OrderType>("Limit");
    const [timeInForce] = React.useState<TimeInForce>("Day");

    const tradePrice = targetPrice ?? props.strategy.credit.toString();

    const isPriceLocked = Boolean(targetPrice);


    const sendOrder = async () => {
        const orderParams: IStrategySendOrderParams = {
            quantity: quantity,
            orderType: orderType,
            timeInForce: timeInForce
        }

        if(targetPrice) {
            orderParams.price = parseFloat(targetPrice);
        }

        await props.strategy.sendOrder(orderParams);
        props.onDitDismiss();
    }

    const onPriceChanged = (value: string) => {
        const p = parseFloat(value);
        if(!Check.isNumber(p)) {
            setTargetPrice(null);
            return;
        }
        setTargetPrice(value);
    }

    const onQuantityChange = (value: string) => {
        const q = parseInt(value);
        if(!Check.isNumber(q)) {
            return;
        }
        setQuantity(Math.max(1, q));
    }


    const renderLockerIcon = () => {
        if(isPriceLocked) {
            return <IonIcon icon={lockClosedOutline}/>
        } else {
            return <IonIcon icon={lockOpenOutline}/>
        }
    }

    const onLockerClick = () => {
        if(isPriceLocked) {
            setTargetPrice(null);
        } else {
            setTargetPrice(props.strategy.credit.toString());
        }
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
                        <FieldLabelBox>{`${services.settings.strategyFilters.priceToUse} price`} </FieldLabelBox>
                        <ReadonlyFieldValueBox>
                            {props.strategy.credit}
                        </ReadonlyFieldValueBox>

                        <RowSeparatorBox/>

                        <FieldLabelBox>Trade price</FieldLabelBox>
                        <TargetPriceBox>
                            <PriceBox value={tradePrice} onChange={e => onPriceChanged(e.target.value)}/>
                            <PriceLockerBox onClick={onLockerClick}>
                                {renderLockerIcon()}
                            </PriceLockerBox>
                        </TargetPriceBox>

                        <RowSeparatorBox/>

                        <FieldLabelBox>Quantity</FieldLabelBox>
                        <QuantityBox type={"number"} value={quantity} onChange={e => onQuantityChange(e.target.value)}/>

                        <RowSeparatorBox/>

                        <FieldLabelBox>Order Type (readonly for the moment)</FieldLabelBox>
                        <ReadonlyFieldValueBox>{orderType}</ReadonlyFieldValueBox>

                        <RowSeparatorBox/>

                        <FieldLabelBox>Time in force (readonly for the moment)</FieldLabelBox>
                        <ReadonlyFieldValueBox>{timeInForce}</ReadonlyFieldValueBox>
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