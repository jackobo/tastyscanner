import React from "react";
import {observer} from "mobx-react";
import {TastyGobyStandardPage} from "../tasty-goby-standard.page";
import {useServices} from "../../hooks/use-services.hook";
import styled from "styled-components";
import {SpinnerComponent} from "../../../framework/components/spinner/spinner.component";
import {UNDERLYING_SYMBOL_WIDTH} from "./constants";
import {UnderlyingActivePositionsModel} from "./underlying-active-positions.model";
import {LeftPanelComponent} from "./components/left-panel.component";
import {RightPanelComponent} from "./components/right-panel.component";
import {NullableString} from "../../../framework/types/nullable-types";

const PAGE_CONTENT_CSS_CLASS = 'active-positions-page-content'
const PAGE_CONTENT_WRAPPER_CSS_CLASS = 'active-positions-page-content-wrapper'

const PageBox = styled(TastyGobyStandardPage)`
    font-size: var(--ion-font-size-body4);

    & .${PAGE_CONTENT_WRAPPER_CSS_CLASS} {
        --padding-end: 0;
        --padding-bottom: 0;
    }
    
    & .${PAGE_CONTENT_CSS_CLASS} {
        display: grid;
        grid-template-columns: ${UNDERLYING_SYMBOL_WIDTH} 1fr;
        overflow-x: auto;
    }
`

export const ActivePositionsPage: React.FC = observer(() => {
    const services = useServices();
    const [selectedUnderlying, setSelectedUnderlying] = React.useState<NullableString>(null);

    const activePositions = services.brokers.currentAccount?.activePositions;

    if(!activePositions || activePositions.isLoading) {
        return (
            <SpinnerComponent fillContainer={true}/>
        )
    }

    const onSelected = (underlying: NullableString) => {
        if(selectedUnderlying === underlying) {
            setSelectedUnderlying(null);
        } else {
            setSelectedUnderlying(underlying);
        }

    }

    const underlyingWithOpenPositions = UnderlyingActivePositionsModel.fromPositions(activePositions.positions);


    return (
        <PageBox pageContentCssClass={PAGE_CONTENT_CSS_CLASS} pageContentWrapperCssClass={PAGE_CONTENT_WRAPPER_CSS_CLASS}>
            <LeftPanelComponent underlyingWithOpenPositions={underlyingWithOpenPositions} selectedUnderlyingSymbol={selectedUnderlying} onUnderlyingSelected={onSelected}/>
            <RightPanelComponent underlyingWithOpenPositions={underlyingWithOpenPositions} selectedUnderlyingSymbol={selectedUnderlying} onUnderlyingSelected={onSelected}/>
        </PageBox>
    )
})
