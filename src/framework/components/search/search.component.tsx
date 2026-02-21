import {observer} from "mobx-react";
import React, {useEffect, useRef} from "react";
import styled from "styled-components";
import {InputBaseBox} from "../input/input-base.box";
import {Debounce} from "../../utils/debounce";
import {TimeSpan} from "../../types/time-span";
import {IonIcon} from "@ionic/react";
import {closeCircleOutline, searchOutline} from "ionicons/icons";

const ContainerBox = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: var(--ion-border-radius);
    width: 100%;
`

const ClearButtonBox = styled.div`
    position: absolute;
    right: var(--ion-space-8);
    cursor: pointer;
`

const SearchIconBox = styled.div`
    position: absolute;
    left: var(--ion-space-8);
    pointer-events: none;
`

const SearchInputBox = styled(InputBaseBox)`
    width: 100%;
    border: 1px solid var(--ion-color-border);
    padding: var(--ion-space-12) var(--ion-space-12) var(--ion-space-12) var(--ion-space-30);
    border-radius: var(--ion-border-radius);
    &:focus {
        border: 1px solid var(--ion-color-border-focused);
    }
    font-size: var(--ion-font-size-body2);
    
`

interface SearchComponentProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    className?: string;
}


export const SearchComponent: React.FC<SearchComponentProps> = observer((props) => {
    const [query, setQuery] = React.useState("");
    const debounceRef = useRef(new Debounce(TimeSpan.fromMilliseconds(250)));

    useEffect(() => {
        const debounce = debounceRef.current;
        return () => {
            debounce.dispose();
        }
    }, []);

    const applySearch = (newQuery: string) => {
        setQuery(newQuery);
        props.onSearch(newQuery);
    }

    const onClearClick = () => {
        applySearch("");
    }

    return (
        <ContainerBox>
            <SearchIconBox>
                <IonIcon icon={searchOutline}/>
            </SearchIconBox>
            <SearchInputBox value={query} className={props.className}
                            placeholder={props.placeholder}
                            onChange={e => applySearch(e.target.value)}/>
            <ClearButtonBox onClick={onClearClick}>
                <IonIcon icon={closeCircleOutline}/>
            </ClearButtonBox>
        </ContainerBox>

    )
})