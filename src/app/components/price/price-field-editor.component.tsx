import React, {useEffect, useRef, useState} from "react";
import {observer} from "mobx-react";
import {IFormField} from "../../../framework/models/forms/form-field.interface";
import {NullablePrice, Price} from "../../models/price/price";
import styled from "styled-components";
import {InputBaseBox} from "../input-base.box";
import {FieldInputContainerComponent} from "../../../framework/components/forms/field-input-container.component";
import {FieldEditorCommonProps} from "../../../framework/components/forms/inputs-common.props";
import {Check} from "../../../framework/utils/type-checking";
import {PriceEffect} from "../../services/brokers/interfaces/open-order-request.interface";
import {useServices} from "../../hooks/use-services.hook";
import {reaction} from "mobx";

const InputBox = styled(InputBaseBox)`
`

interface PriceFieldEditorComponentProps extends FieldEditorCommonProps{
    field: IFormField<Price>;
    priceEffect: PriceEffect;
    onChange?: (value: NullablePrice) => void;
}

export const PriceFieldEditorComponent: React.FC<PriceFieldEditorComponentProps> = observer((props) => {
    const [inputValue, setInputValue] = useState<string>(props.field.value?.value?.toFixed(2) ?? "");
    const services = useServices();
    const reactionEnabled = useRef(true);

    const isReadOnly = Boolean(props.isReadonly) || props.field.isReadOnly;

    const formatPriceValue = (price: NullablePrice)=> {
        if(price) {
            return price.value.toFixed(2);
        } else {
            return "";
        }
    }

    useEffect(() => {
        const r = reaction(() => props.field.value, (price) => {
            if(reactionEnabled.current) {
                setInputValue(formatPriceValue(price));
            }
        });

        return () => r();

    }, [props.field.value]);



    const setFieldValue = (price: NullablePrice) =>  {
        reactionEnabled.current = false;
        try {
            props.field.setValue(price);
        } finally {
            reactionEnabled.current = true;
        }
    }

    const triggerOnChange = (price: NullablePrice) => {
        if(props.onChange) {
            props.onChange(price);
        }
    }

    const updateValue = (value: string | number | null | undefined) => {
        props.field.setCustomError(null);
        setInputValue(value?.toString() ?? "");
        if(Check.isNullOrUndefined(value) || Check.isEmpty(value)) {
            setFieldValue(null);
            triggerOnChange(null);
        } else {
            const numericValue = parseFloat(value.toString());
            if(Check.isNumber(numericValue)) {
                const p = new Price(numericValue, props.priceEffect);
                setFieldValue(p);
                triggerOnChange(p);
            } else {
                props.field.setCustomError(services.language.translate("Not a valid value"));
            }

        }
    }

    const renderInput = () => {
        return (
            <InputBox  type={"text"}
                       inputMode={"numeric"}
                       autoComplete="off"
                       autoCorrect="off"
                       autoCapitalize={"off"}
                       spellCheck={false}
                       ref={props.field.attachInputDOMElement}
                       value={inputValue}
                       readOnly={isReadOnly}
                       onChange={(e) => updateValue(e.target.value)}
                       className={props.className}/>
        );
    }


    return (
        <FieldInputContainerComponent {...props} isReadonly={isReadOnly} renderInput={renderInput} />
    );
})
