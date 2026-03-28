import styled from "styled-components";

const ErrorBox = styled.div`
    position: absolute;
    bottom: 0;
    left: 4px;
    transform: translateY(100%);
    color: var(--ion-color-danger);
    font-size: var(--ion-font-size-caption);
`

export function renderError(error: string) {
    if(!error) {
        return null;
    }

    return (
        <ErrorBox>
            {error}
        </ErrorBox>
    )
}