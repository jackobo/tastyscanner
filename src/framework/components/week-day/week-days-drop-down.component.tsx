import React from "react";
import {observer} from "mobx-react";
import {IFormField} from "../../models/forms/form-field.interface";
import styled from "styled-components";
import {DropDownComponent} from "../forms/drop-down/drop-down.component";
import {WeekDayModel} from "../../services/time/week-day.model";
import {CheckboxComponent} from "../checkbox/checkbox.component";
import {InputBaseBox} from "../input/input-base.box";
import {useFrameworkServices} from "../../hooks/use-framework-services.hook";

const DropDownInputBox = styled(InputBaseBox)<{$isReadOnly: boolean}>`
    width: 100%;
    cursor: ${props => props.$isReadOnly ? 'not-allowed' : 'unset'}
`

const DropDownContentBox = styled.div`
    display: flex;
    flex-direction: column;
    color: var(--ion-color-dark);
`


const CheckBox = styled(CheckboxComponent)`
    width: 100%;
    padding: var(--ion-space-12);
    cursor: pointer;
    border-bottom: 1px solid var(--ion-color-border);
    &:hover {
        background-color: var(--ion-color-light-shade);
    }

    &:last-of-type {
        border-bottom: none;
    }
`

interface DropDownItemComponentProps {
    weeDay: WeekDayModel;
    currentSelectedWeekDaysNumbers: number[];
    onSelect: () => void;
    onUnselect: () => void;
}

const DropDownItemComponent: React.FC<DropDownItemComponentProps> = observer((props) => {
    const isSelected = props.currentSelectedWeekDaysNumbers.includes(props.weeDay.id);

    const onChange = (isChecked: boolean) => {
        if(isChecked) {
            props.onSelect();
        } else {
            props.onUnselect();
        }
    }

    return (
        <CheckBox checked={isSelected} onChange={onChange} label={props.weeDay.name} labelPlacement={"end"}/>
    );
})

interface WeekDaysDropDownComponentProps {
    field: IFormField<number[]>;
}

export const WeekDaysDropDownComponent: React.FC<WeekDaysDropDownComponentProps> = observer((props) => {
    const services = useFrameworkServices();
    const allWeekDays = services.time.getWeekDays();
    let selectedWeekDaysNumbers = [...(props.field.value ?? [])];


    const renderInput = () => {
        const selectedWeekDays = allWeekDays.filter(wd => selectedWeekDaysNumbers.includes(wd.id));
        return (
            <DropDownInputBox readOnly={true}
                              $isReadOnly={props.field.isReadOnly}
                              value={selectedWeekDays.map(wd => wd.abbreviation).join(", ")}/>
        )
    }

    const removeWeekDay = (weekDayNumber: number) => {
        props.field.setValue(selectedWeekDaysNumbers.filter(n => n !== weekDayNumber));
    }

    const addWeekDayNumber = (weekDayNumber: number) => {
        selectedWeekDaysNumbers.push(weekDayNumber);
        selectedWeekDaysNumbers = selectedWeekDaysNumbers.sort((a, b) => a - b);
        props.field.setValue([...selectedWeekDaysNumbers]);
    }

    const renderOneItem = (wd: WeekDayModel) => {
        return (
            <DropDownItemComponent key={wd.id}
                                   weeDay={wd}
                                   currentSelectedWeekDaysNumbers={selectedWeekDaysNumbers}
                                   onSelect={() => addWeekDayNumber(wd.id)}
                                   onUnselect={() => removeWeekDay(wd.id)}/>
        )
    }

    const renderDropDownContent = () => {
        return (
            <DropDownContentBox>
                {allWeekDays.map(renderOneItem)}
            </DropDownContentBox>
        )
    }

    return (
        <DropDownComponent renderDropDownInput={renderInput}
                           renderDropDownContent={renderDropDownContent}
                           renderLabel={() => props.field.fieldName}
                           errorMessage={props.field.activatedError}
                           isReadonly={props.field.isReadOnly}/>
    );
})