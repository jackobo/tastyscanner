import styled from "styled-components";


export const InputBaseBox = styled.input`
    border: none;
    width: 100%;
    background: transparent;
    outline: none;
    padding: 0;
    margin: 0;
    &:focus {
        border: none;
    }
    &::selection {
        background-color: Highlight;
        color: HighlightText;
    }
    &::placeholder {
        color: var(--ion-color-medium-tint);
        font-weight: inherit;
    }
    cursor: ${props => props.readOnly ? 'not-allowed' : 'unset'}
`



