import {createGlobalStyle} from "styled-components";

export const GlobalStyles = createGlobalStyle`
    html {
        font-size: 16px;
    }
    
    body {
        font-size: var(--ion-font-size-body1);
        background-color: var(--ion-color-light);
        color: var(--ion-color-light-contrast);
    }
    
    table {
        font-size: var(--ion-font-size-body2);
    }
`