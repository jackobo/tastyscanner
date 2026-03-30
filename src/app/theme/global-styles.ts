import {createGlobalStyle} from "styled-components";
export const SCROLLBAR_WIDTH = '7px';

export const GlobalStyles = createGlobalStyle`
        // Chrome and Safari scrollbar
        *::-webkit-scrollbar {
                width: ${SCROLLBAR_WIDTH};
        }

        *::-webkit-scrollbar-track {
                background-color: rgba(var(--ion-color-medium-rgb), 0.1);
        }

        *::-webkit-scrollbar-thumb {
                background-color: rgba(var(--ion-color-medium-rgb), 0.5);
        }

        *::-webkit-scrollbar-thumb:hover {
                background-color: rgba(var(--ion-color-medium-rgb), 0.8);
        }
        
    html {
        font-size: 16px;
        scrollbar-gutter: stable;

        ${props => props.theme.screenMediaQuery.sAndBelow} {
            font-size: 14px;
        }
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