import styled from "styled-components";
import {IonRange} from "@ionic/react";

export const RangeBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: var(--ion-space-16);
`

export const IonRangeBox = styled(IonRange)`
    --height: 32px;
`