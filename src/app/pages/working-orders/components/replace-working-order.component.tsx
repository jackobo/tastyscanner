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
`
const HeaderBox = styled.div`
    border-bottom: 1px solid var(--ion-color-border);
`

const BodyBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--ion-space-16);
    padding: var(--ion-space-20);
`


const TitleContainerBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: var(--ion-space-20);
    
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
    const formRef = useRef<ReplaceWorkingOrderFormModel>(new ReplaceWorkingOrderFormModel(props.workingOrder, services));

    useEffect(() => {
        const form = formRef.current;
        props.workingOrder.suspendAutoReplace();
        return () => {
            form.dispose();
            props.workingOrder.resumeAutoReplace();
        }
    })

    const togglePriceLock = () => {
        formRef.current.togglePriceLock();
    }

    const decrementPrice = () => {
        formRef.current.decrementPrice();
    }

    const incrementPrice = () => {
        formRef.current.incrementPrice();
    }

    const sendOrder = async () => {
        await formRef.current.sendOrder();
    }


    const renderLockIcon = () => {
        if(formRef.current.fields.isPriceLocked.value) {
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
            <HeaderBox>
                <TitleContainerBox>
                    <TitleBox>
                        {services.language.translate('Replace order')}
                    </TitleBox>
                    <CloseButtonBox onClick={props.onCloseClick}>
                        <IonIcon icon={closeOutline}/>
                    </CloseButtonBox>
                </TitleContainerBox>
            </HeaderBox>

            <BodyBox>
                <PriceContainerBox>
                    <PriceLabelContainerBox>
                        <span>{formRef.current.fields.price.fieldName}</span>
                        <SpecializedButtonComponent renderIcon={renderLockIcon} onClick={togglePriceLock}/>
                    </PriceLabelContainerBox>
                    <PriceInputContainerBox>

                        {renderPlusMinus(removeCircleOutline, decrementPrice)}

                        <PriceInputComponent field={formRef.current.fields.price} hideLabel={true} cssClassesForOutsideBordersStyle={{
                            inputAndIconContainer: 'price-input-container',
                        }}/>

                        {renderPlusMinus(addCircleOutline, incrementPrice)}

                    </PriceInputContainerBox>
                </PriceContainerBox>

                {props.workingOrder.isGobyOrder && props.workingOrder.numberOfAutoReplaceAttempts > 0 && <BooleanFieldEditorComponent field={formRef.current.fields.resetAutoReplaceAttempts}/>}

                <PrimaryButton showArrow={true} onClick={sendOrder}>
                    {services.language.translate('Send order')}
                </PrimaryButton>

            </BodyBox>

        </ContainerBox>
    )
})