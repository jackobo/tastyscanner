import styled, {css} from "styled-components";

export const StrategyBox = styled.div<{$isBestPop: boolean; $isBestRiskReward: boolean}>`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 24px;
    ${props => props.$isBestPop && css`
        background-color: var(--ion-color-warning-tint);
        color: var(--ion-color-warning-contrast);
    `}
    ${props => props.$isBestRiskReward && css`
        background-color: var(--ion-color-primary-tint);
        color: var(--ion-color-primary-contrast);
    `}
`