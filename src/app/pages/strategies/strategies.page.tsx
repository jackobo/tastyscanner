import React from "react";
import {observer} from "mobx-react-lite";
import {TastyGobyStandardPage} from "../tasty-goby-standard.page";
import {useServices} from "../../hooks/use-services.hook";
import {SpinnerComponent} from "../../../framework/components/spinner/spinner.component";
import styled from "styled-components";
import {ITickerViewModel} from "../../models/ticker/ticker.view-model.interface";

const PageContentBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--ion-space-12);
    width: 100%;
    flex-grow: 1;
`

const StrategyTitleBox = styled.div`
    position: sticky;
    top: 0;
    font-size: var(--ion-font-size-h3);
    font-weight: var(--ion-font-weight-bold);
    text-align: center;
`

const NoTickerSelectedBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--ion-color-danger);
    width: 100%;
    height: 100%;
`

interface StrategiesPageProps {
    renderContent: (ticker: ITickerViewModel) => React.ReactElement;
    strategyName: string;
}

export const StrategiesPage: React.FC<StrategiesPageProps> = observer((props) => {
    const services = useServices();

    const ticker = services.tickers.currentTicker;
    if(!ticker) {
        return null;
    }

    const renderPageContent = () => {
        if(!ticker) {
            return (
                <NoTickerSelectedBox>
                    {services.language.translate('No ticker selected.')}
                </NoTickerSelectedBox>
            );
        }
        if(ticker.isLoading) {
            return (
                <SpinnerComponent fillContainer={true} />
            );
        }

        return props.renderContent(ticker);
    }

    return (
        <TastyGobyStandardPage>
            <PageContentBox>
                <StrategyTitleBox>
                    {`${ticker?.symbol} ${props.strategyName}`}
                </StrategyTitleBox>
                {renderPageContent()}
            </PageContentBox>

        </TastyGobyStandardPage>
    )
});

