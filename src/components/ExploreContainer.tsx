import React, {useState} from 'react';
import './ExploreContainer.css';
import {TastyApiService} from "../services/tasty-api.service";
import styled from "styled-components";

interface ContainerProps {
  name: string;
}


const ContainerBox = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    position: absolute;
    height: 100%;
    width: 100%;
    
    gap: 16px;
`

const ResultBox = styled.div`
    white-space: pre-wrap;
    
`

const ButtonBox = styled.button`
    height: 50px;
`

const OptionsQuotesButtonBox = styled.div`
    display: flex;
    flex-direction: column;
`


const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
    console.log(name);
    const [nestedOptionsChains, setNestedOptionsChains] = React.useState<string>("");
    const [detailedOptionsChains, setDetailedOptionsChains] = React.useState<string>("");
    const [optionsQuotes, setOptionsQuotes] = React.useState<string>("");
    const [optionsQuotesSymbols, setOptionsQuotesSymbols] = useState<string>("");

    const fetchNestedOptionsChains = async () => {
        const data = await TastyApiService.Instance.getNestedOptionsChain('NVDA');
        setNestedOptionsChains(JSON.stringify(data, null, 2));

    }

    const fetchDetailedOptionsChains = async () => {
        const data = await TastyApiService.Instance.getDetailedOptionsChain('NVDA');
        setDetailedOptionsChains(JSON.stringify(data, null, 2));

    }

    const fetchdOptionQuote = async () => {
        const data = await TastyApiService.Instance.getOptionQuote(optionsQuotesSymbols);
        setOptionsQuotes(JSON.stringify(data, null, 2));

    }

    return (
        <ContainerBox>
            <ButtonBox onClick={fetchNestedOptionsChains}>
                Nested options chain
            </ButtonBox>
            <ButtonBox onClick={fetchDetailedOptionsChains}>
                Detailed options chain
            </ButtonBox>
            <OptionsQuotesButtonBox>
                <ButtonBox onClick={fetchdOptionQuote}>
                    Options quotes
                </ButtonBox>
                <input value={optionsQuotesSymbols} type="text" placeholder="Enter option symbol" onChange={(e) => setOptionsQuotesSymbols(e.target.value)}/>
            </OptionsQuotesButtonBox>


            <ResultBox>
                {nestedOptionsChains}
            </ResultBox>

            <ResultBox>
                {detailedOptionsChains}
            </ResultBox>

            <ResultBox>
                {optionsQuotes}
            </ResultBox>
        </ContainerBox>
    );
};

export default ExploreContainer;
