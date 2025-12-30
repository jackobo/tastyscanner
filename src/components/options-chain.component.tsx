import React from 'react';
import {observer} from 'mobx-react-lite'
import {useServices} from "../hooks/use-services.hook";
import {IOptionsExpirationVewModel} from "../models/options-expiration.view-model.interface";
import {IOptionStrikeViewModel} from "../models/option-strike.view-model.interface";
import styled from "styled-components";

const ExpirationBox = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`

const ExpirationTitleBox = styled.div`
    width: 100%;
    background-color: gray;
    padding: 16px;
`

const ExpirationStrikesBox = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    width: 100%;
    gap: 16px;
    padding: 16px;
`

const OptionsExpirationComponent: React.FC<{expiration: IOptionsExpirationVewModel}> = observer((props) => {
    const strikes = props.expiration.strikes;

    const renderStrike = (strike: IOptionStrikeViewModel) => {
        return <React.Fragment key={strike.strikePrice}>
            <div>
                {strike.call.lastPrice}
            </div>

            <div>
                {strike.call.delta}
            </div>

            <div>
                {strike.strikePrice}
            </div>

            <div>
                {strike.put.lastPrice}
            </div>

            <div>
                {strike.put.delta}
            </div>

        </React.Fragment>
    }

    return (
        <ExpirationBox>
            <ExpirationTitleBox>{`${props.expiration.expirationDate} (${props.expiration.daysToExpiration}) - ${props.expiration.expirationType}`}</ExpirationTitleBox>
            <ExpirationStrikesBox>
                <div>Call price</div>
                <div>Call delta</div>
                <div>Strike</div>
                <div>Put price</div>
                <div>Put delta</div>
                { strikes.map(renderStrike)}
            </ExpirationStrikesBox>
        </ExpirationBox>
    )
})

export const OptionsChainComponent: React.FC = observer(() => {
    const services = useServices();

    const ticker = services.optionsChains.currentTicker;

    const expirations = ticker.expirations;

    return <React.Fragment>
        {expirations.map(expiration => <OptionsExpirationComponent key={expiration.expirationDate} expiration={expiration}/>)}
    </React.Fragment>
})