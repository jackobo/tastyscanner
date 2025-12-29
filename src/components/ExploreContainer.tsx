import React, {useEffect} from 'react';
import './ExploreContainer.css';
import {TastyApiService} from "../services/tasty-api.service";
import styled from "styled-components";
import {observer} from "mobx-react-lite";
import {OptionsExpirationModel} from "../models/options-expiration.model";
import {OptionStrikeModel} from "../models/option-strike.model";

interface ContainerProps {
  name: string;
}

const ContainerBox = styled.div`
    position: absolute;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
`

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

const OptionsExpirationComponent: React.FC<{expiration: OptionsExpirationModel}> = observer((props) => {
    const strikes = props.expiration.strikes;

    const renderStrike = (strike: OptionStrikeModel) => {
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


const ExploreContainer: React.FC<ContainerProps> = observer(({ name }) => {

    console.log(name);
    useEffect(() => {
        TastyApiService.Instance.start();
    }, []);

    const ticker = TastyApiService.Instance.tickers[0];

    const expirations = ticker.expirations;
    return (
        <ContainerBox>
            <div>
                <span>{ticker.symbol}</span>
                <span>:</span>
                <span>{ticker.currentPrice}</span>
            </div>
            {expirations.map(expiration => <OptionsExpirationComponent key={expiration.expirationDate} expiration={expiration}/>)}
        </ContainerBox>

    );
});

export default ExploreContainer;
