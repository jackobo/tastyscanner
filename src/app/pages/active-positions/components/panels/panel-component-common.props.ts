import {NullableString} from "../../../../../framework/types/nullable-types";
import {IUnderlyingActivePositionsViewModel} from "../../../../services/brokers/interfaces/active-position.interfaces";

export interface PanelComponentCommonProps {
    expandedUnderlyingSymbol: NullableString;
    underlyingWithOpenPositions: IUnderlyingActivePositionsViewModel[];
    onUnderlyingHeaderClick: (underlyingSymbol: string) => void;
}