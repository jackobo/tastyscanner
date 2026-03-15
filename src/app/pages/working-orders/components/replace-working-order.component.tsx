import React, {useEffect, useRef} from "react";
import {IWorkingOrderViewModel} from "../../../services/brokers/interfaces/working-order.interfaces";
import {observer} from "mobx-react";
import styled from "styled-components";
import {useServices} from "../../../hooks/use-services.hook";
import {IonIcon} from "@ionic/react";
import {addCircleOutline, closeOutline, lockClosedOutline, lockOpenOutline, removeCircleOutline} from "ionicons/icons";
import {
    SpecializedButtonComponent
} from "../../../../framework/components/specialized-buttons/specialized-button.component";
import {PrimaryButton} from "../../../../framework/components/buttons/primary-button";
import {
    StringFieldEditorComponent
} from "../../../../framework/components/forms/string-field/string-field-editor.component";
import {Check} from "../../../../framework/utils/type-checking";
import {ReplaceWorkingOrderFormModel} from "./replace-working-order-form.model";
import {
    BooleanFieldEditorComponent
} from "../../../../framework/components/forms/boolean-field/boolean-field-editor.component";


const ContainerBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--ion-space-24);
    padding: var(--ion-space-16);
`

const TitleContainerBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-bottom: var(--ion-space-12);
    border-bottom: 1px solid var(--ion-color-border);
`

const TitleBox = styled.div`
    font-size: var(--ion-font-size-body1);
    font-weight: var(--ion-font-weight-bold);
    flex-grow: 1;
`

const CloseButtonBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    align-content: center;
    width: 24px;
    cursor: pointer;
    
`

const PriceContainerBox = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: var(--ion-border-radius);
    padding: var(--ion-space-8);
    border: 1px solid var(--ion-color-border);
`

const PriceInputContainerBox = styled.div`
    display: flex;
    flex-direction: row;
    gap: var(--ion-space-8);
    
`

const PriceLabelContainerBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: var(--ion-space-8);
    border-bottom: 1px solid var(--ion-color-border);
    margin: 0 calc(-1 * var(--ion-space-8));
`


const PlusMinusIconBox = styled(SpecializedButtonComponent)`
    font-size: 24px;
`

const PriceInputComponent = styled(StringFieldEditorComponent)`
    text-align: center;
    & .price-input-container {
        border: none;
    }
`



interface ReplaceWorkingOrderComponentProps {
    workingOrder: IWorkingOrderViewModel;
    onCloseClick: () => void;
}

export const ReplaceWorkingOrderComponent: React.FC<ReplaceWorkingOrderComponentProps> = observer((props) => {
    const services = useServices();
    const form = useRef<ReplaceWorkingOrderFormModel>(new ReplaceWorkingOrderFormModel(props.workingOrder, services));

    useEffect(() => {
        form.current.dispose();
    }, [])

    const togglePriceLock = () => {
        form.current.togglePriceLock();
    }

    const decrementPrice = () => {
        form.current.decrementPrice();
    }

    const incrementPrice = () => {
        form.current.incrementPrice();
    }

    const sendOrder = async () => {
        await form.current.sendOrder();
    }


    const renderLockIcon = () => {
        if(form.current.fields.isPriceLocked.value) {
            return (<IonIcon icon={lockClosedOutline}/>)
        } else {
            return (<IonIcon icon={lockOpenOutline}/>)
        }
    }

    const renderPlusMinus = (iconName: string, onClick: () => void  ) => {
        if(Check.isNullOrUndefined(props.workingOrder.optionsTickSize)) {
            return null;
        }

        return (
            <PlusMinusIconBox renderIcon={() => (<IonIcon icon={iconName}/>)}
                              onClick={onClick}/>
        )
    }



    return (
        <ContainerBox>
            <TitleContainerBox>
                <TitleBox>
                    {services.language.translate('Replace order')}
                </TitleBox>
                <CloseButtonBox onClick={props.onCloseClick}>
                    <IonIcon icon={closeOutline}/>
                </CloseButtonBox>
            </TitleContainerBox>
            <PriceContainerBox>
                <PriceLabelContainerBox>
                    <span>{form.current.fields.price.fieldName}</span>
                    <SpecializedButtonComponent renderIcon={renderLockIcon} onClick={togglePriceLock}/>
                </PriceLabelContainerBox>
                <PriceInputContainerBox>

                    {renderPlusMinus(removeCircleOutline, decrementPrice)}

                    <PriceInputComponent field={form.current.fields.price} hideLabel={true} cssClassesForOutsideBordersStyle={{
                        inputAndIconContainer: 'price-input-container',
                    }}/>

                    {renderPlusMinus(addCircleOutline, incrementPrice)}

                </PriceInputContainerBox>
            </PriceContainerBox>

            <BooleanFieldEditorComponent field={form.current.fields.resetAutoReplaceAttempts}/>

            <PrimaryButton showArrow={true} onClick={sendOrder}>
                {services.language.translate('Send order')}
            </PrimaryButton>

        </ContainerBox>
    )
})