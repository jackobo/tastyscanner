import React, {useEffect, useRef} from "react";
import {IWorkingOrderViewModel} from "../../../services/brokers/interfaces/working-order.interfaces";
import {observer} from "mobx-react";
import styled from "styled-components";
import {useServices} from "../../../hooks/use-services.hook";
import {IonIcon} from "@ionic/react";
import {addCircleOutline, lockClosedOutline, lockOpenOutline, removeCircleOutline} from "ionicons/icons";
import {
    SpecializedButtonComponent
} from "../../../../framework/components/specialized-buttons/specialized-button.component";
import {PrimaryButton} from "../../../../framework/components/buttons/primary-button";
import {
    StringFieldEditorComponent
} from "../../../../framework/components/forms/string-field/string-field-editor.component";
import {Check} from "../../../../framework/utils/type-checking";
import {ReplaceWorkingOrderFormModel} from "./replace-working-order-form.model";


const ContainerBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--ion-space-24);
    padding: var(--ion-space-16);
`

const TitleBox = styled.div`
    font-size: var(--ion-font-size-body1);
    font-weight: var(--ion-font-weight-bold);
    padding-bottom: var(--ion-space-12);
    border-bottom: 1px solid var(--ion-color-border);
`

const PriceContainerBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    
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
`


const PlusMinusIconBox = styled(SpecializedButtonComponent)`
    font-size: 32px;
`

const PriceInputComponent = styled(StringFieldEditorComponent)`
    text-align: center;
`


export const ReplaceWorkingOrderComponent: React.FC<{workingOrder: IWorkingOrderViewModel}> = observer((props) => {
    const services = useServices();
    const form = useRef<ReplaceWorkingOrderFormModel>(new ReplaceWorkingOrderFormModel(props.workingOrder, services));

    useEffect(() => {
        form.current.dispose();
    }, [])

    const decrementPrice = () => {
        form.current.decrementPrice();
    }

    const incrementPrice = () => {
        form.current.incrementPrice();
    }


    const sendOrder = async () => {

    }

    const toggleLockPrice = () => {
        form.current.fields.lockPrice.setValue(!form.current.fields.lockPrice.value);
    }

    const renderLockIcon = () => {
        if(form.current.fields.lockPrice.value) {
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
            <TitleBox>
                {services.language.translate('Replace order')}
            </TitleBox>
            <PriceContainerBox>
                <PriceLabelContainerBox>
                    <span>{form.current.fields.price.fieldName}</span>
                    <SpecializedButtonComponent renderIcon={renderLockIcon} onClick={toggleLockPrice}/>
                </PriceLabelContainerBox>
                <PriceInputContainerBox>

                    {renderPlusMinus(removeCircleOutline, decrementPrice)}

                    <PriceInputComponent field={form.current.fields.price} hideLabel={true}/>

                    {renderPlusMinus(addCircleOutline, incrementPrice)}

                </PriceInputContainerBox>
            </PriceContainerBox>


            <PrimaryButton showArrow={true} onClick={sendOrder}>
                {services.language.translate('Send order')}
            </PrimaryButton>

        </ContainerBox>
    )
})