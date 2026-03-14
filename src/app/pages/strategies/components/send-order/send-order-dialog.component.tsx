import React from "react";
import {IOptionsStrategySendOrderParams, IOptionsStrategyViewModel} from "../../../../models/options-strategy.view-model.interface";
import {IonIcon} from "@ionic/react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {InputBaseBox} from "../../../../components/input-base.box";
import {chevronDown, chevronUp, lockClosedOutline, lockOpenOutline} from "ionicons/icons";
import {IOptionsStrategyLegViewModel} from "../../../../models/options-strategy-leg.view-model.interface";
import {NullableString} from "../../../../../framework/types/nullable-types";
import {Check} from "../../../../../framework/utils/type-checking";
import {
    StandardDialogPageComponent
} from "../../../../../framework/components/modal/page/standard-dialog-page.component";
import {IDialogHandler} from "../../../../../framework/services/dialog/dialog.service.interface";
import {
    StandardDialogHeaderComponent
} from "../../../../../framework/components/modal/header/standard-dialog-header.component";
import {useServices} from "../../../../hooks/use-services.hook";
import {
    StandardDialogContentComponent
} from "../../../../../framework/components/modal/content/standard-dialog-content.component";
import {
    StandardDialogFooterComponent
} from "../../../../../framework/components/modal/footer/standard-dialog-footer.component";
import {PrimaryButton} from "../../../../../framework/components/buttons/primary-button";
import {OrderType, TimeInForce} from "../../../../services/brokers/interfaces/open-order-request.interface";

const SpacerBox = styled.div`
    grid-column: 1/-1;
    width: 100%;
    height: 8px;
`

const FieldsGridBox = styled.div`
    display: grid;
    grid-template-columns: 1.5fr repeat(5, 1fr);
    row-gap: 4px;
    padding: 0 16px;
`

const FieldLabelBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`

const ReadonlyFieldValueBox = styled(FieldLabelBox)`
    
`

const MidPriceValueBox = styled(ReadonlyFieldValueBox)`
    text-align: center;
    padding: 8px;
    border: 1px solid var(--ion-color-light-shade);
    border-radius: 8px;
`

const ValueEditorContainerBox = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 4px;
    grid-column: 1/-1;
    width: 100%;
    
`

const ValueEditorInputContainerBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    width: 100%;
`

const ValueEditorInputInnerContainerBox = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    width: 100%;
`

const ValueInputBox = styled(InputBaseBox)`
    height: fit-content;
    text-align: center;
    flex-grow: 1;
    width: 100%;
`

const ChevronBox = styled.div`
    position: absolute;
    font-size: 1.3rem;
    cursor: pointer;
`

const ChevronLeftBox = styled(ChevronBox)`
    left: 4px;
`

const ChevronRightBox = styled(ChevronBox)`
    right: 4px;
`

const LockerBox = styled.div`
    position: absolute;
    right: 0;
    transform: translateX(calc(100% + 4px));
    cursor: pointer;
    font-size: 1.3rem;
`

const LegCellBox = styled.div`
    border-bottom: 1px solid var(--ion-color-light-shade);
    padding: 4px;
    width: 100%;
    text-align: center;
`

const LegExpirationCellBox = styled(LegCellBox)`
    text-align: left;
`

const LegPriceCellBox = styled(LegCellBox)`
    text-align: right;
`

const LegTypeCellBox = styled(LegCellBox)<{$isSell: boolean}>`
    width: 120px;
    color: ${props => props.$isSell ? "var(--ion-color-danger)" : "var(--ion-color-success)"};
`

const OrderTypeBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    grid-column: 1/3;
    width: 100%;
`

const TimeInForceBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    grid-column: 4/6;
    width: 100%;
`

const LegComponent: React.FC<{leg: IOptionsStrategyLegViewModel}> = observer((props) => {
    return (
        <>
            <LegExpirationCellBox>{props.leg.option.expirationDate}</LegExpirationCellBox>
            <LegCellBox>{`${props.leg.option.daysToExpiration}d`}</LegCellBox>
            <LegCellBox>{props.leg.option.strikePrice}</LegCellBox>
            <LegCellBox>{props.leg.option.optionType}</LegCellBox>
            <LegTypeCellBox $isSell={props.leg.isSell}>
                {props.leg.legActionType}
            </LegTypeCellBox>
            <LegPriceCellBox>{props.leg.isSell ? props.leg.option.midPrice : -1 * props.leg.option.midPrice}</LegPriceCellBox>
        </>
    )
})

const MidPriceBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    grid-column: 1/-1;
    width: 100%;
`

interface ValueEditorComponentProps {
    //strategy: IOptionsStrategyViewModel;
    label: string;
    onValueChanged: (price: NullableString) => void;
    value: NullableString;
    defaultValue: string;
    parseValue: (value: NullableString) => number;
    offset: number;
    onLockerClick?: (isLocked: boolean) => void;
}

const ValueEditorComponent: React.FC<ValueEditorComponentProps> = observer((props) => {
    const value = props.value ?? props.defaultValue;
    const isLocked = Boolean(props.value);

    const onValueChanged = (value: string) => {
        const p = props.parseValue(value);
        if(Check.isNumber(p)) {
            props.onValueChanged(value);
        } else {
            props.onValueChanged(null);
        }
    }


  const onLockerClick = () => {

      if (props.onLockerClick) {
          props.onLockerClick(isLocked);
      }

  }


    const renderLockerIcon = () => {
        if(!props.onLockerClick) {
            return null;
        }
        if(isLocked) {

            return (
                <IonIcon icon={lockClosedOutline}/>
            )


        } else {
            return (
                <IonIcon icon={lockOpenOutline}/>
            )
        }
    }

    const changeValue = (offsetSign: number) => {
        let v = props.parseValue(value);
        if(!Check.isNumber(v)) {
            return;
        }
        v = Math.round(v * 100) / 100;
        if(Check.isNumber(v)) {
            props.onValueChanged((Math.round((v + (offsetSign * props.offset))*100)/100).toString());
        }
    }

    const increment = () => {
        changeValue(1);

    }

    const decrement = () => {
        changeValue(-1);
    }


    return (
       <ValueEditorContainerBox>
           <FieldLabelBox>
               {props.label}
           </FieldLabelBox>
           <ValueEditorInputContainerBox>
               <ValueEditorInputInnerContainerBox>
                   <ChevronLeftBox onClick={decrement}>
                       <IonIcon icon={chevronDown}/>
                   </ChevronLeftBox>
                   <ValueInputBox value={value} onChange={e => onValueChanged(e.target.value)}/>
                   <ChevronRightBox onClick={increment}>
                       <IonIcon icon={chevronUp}/>
                   </ChevronRightBox>
               </ValueEditorInputInnerContainerBox>

               <LockerBox onClick={onLockerClick}>
                   {renderLockerIcon()}
               </LockerBox>


           </ValueEditorInputContainerBox>


       </ValueEditorContainerBox>
    )
})


interface SendOrderDialogComponentProps {
    dialogHandler: IDialogHandler;
    strategy: IOptionsStrategyViewModel;
}

export const SendOrderDialogComponent: React.FC<SendOrderDialogComponentProps> = observer((props) => {
    const services = useServices();
    const [limitPrice, setLimitPrice] = React.useState<NullableString>(null);
    const [quantity, setQuantity] = React.useState<number>(1);
    const [orderType] = React.useState<OrderType>("Limit");
    const [timeInForce] = React.useState<TimeInForce>("Day");

    const limitPriceAsNumber = limitPrice ? parseFloat(limitPrice) : null;

    const optionPriceTickSize = props.strategy.getOptionTickSize(limitPriceAsNumber ?? props.strategy.credit);

    const onLockerClick = (isLocked: boolean) => {
        if(isLocked) {
            setLimitPrice(null);
        } else {
            setLimitPrice(props.strategy.credit.toString());
        }
    }

    const sendOrder = async () => {
        const orderParams: IOptionsStrategySendOrderParams = {
            quantity: quantity,
            orderType: orderType,
            timeInForce: timeInForce
        }

        if(limitPriceAsNumber) {
            orderParams.price = limitPriceAsNumber;
        }

        //TODO - better handle error reporting
        try {
            await props.strategy.sendOrder(orderParams);
            props.dialogHandler.accept();
        } catch (err) {
            await services.toaster.showErrorToast({
                renderContent: () => services.language.translate('Failed to send order')
            })
        }

    }

    const onQuantityChange = (value: NullableString) => {
        const q = parseInt(value ?? "1");
        if(Check.isNumber(q)) {
            setQuantity(Math.max(1, q));
        }

    }

    return (
        <StandardDialogPageComponent>
            <StandardDialogHeaderComponent dialogHandler={props.dialogHandler} title={services.language.translate("Place new order")}/>
            <StandardDialogContentComponent dialogHandler={props.dialogHandler}>
                <FieldsGridBox>

                    {props.strategy.legs.map(leg => (<LegComponent key={leg.key} leg={leg}/>))}

                    <SpacerBox/>

                    <MidPriceBox>
                        <FieldLabelBox>
                            {`Mid price`}
                        </FieldLabelBox>
                        <MidPriceValueBox>
                            {props.strategy.credit}
                        </MidPriceValueBox>
                    </MidPriceBox>

                    <SpacerBox/>

                    <ValueEditorComponent  value={ limitPrice}
                                           defaultValue={props.strategy.credit.toString()}
                                           onValueChanged={setLimitPrice}
                                           parseValue={value => parseFloat(value ?? "")}
                                           label={"Limit Price"}
                                           offset={optionPriceTickSize}
                                           onLockerClick={onLockerClick}/>




                    <SpacerBox/>

                    <ValueEditorComponent  value={ quantity.toString()}
                                           defaultValue={"1"}
                                           onValueChanged={onQuantityChange}
                                           parseValue={value => parseInt(value ?? "1")}
                                           label={"Quantity"}
                                           offset={1}/>



                    <SpacerBox/>

                    <OrderTypeBox>
                        <FieldLabelBox>Order Type</FieldLabelBox>
                        <ReadonlyFieldValueBox>{orderType}</ReadonlyFieldValueBox>
                    </OrderTypeBox>

                    <TimeInForceBox>
                        <FieldLabelBox>Time in force</FieldLabelBox>
                        <ReadonlyFieldValueBox>{timeInForce}</ReadonlyFieldValueBox>
                    </TimeInForceBox>

                </FieldsGridBox>
            </StandardDialogContentComponent>
            <StandardDialogFooterComponent dialogHandler={props.dialogHandler}>
                <PrimaryButton onClick={sendOrder}>
                    {services.language.translate("Send order")}
                </PrimaryButton>
            </StandardDialogFooterComponent>
        </StandardDialogPageComponent>
    );
})