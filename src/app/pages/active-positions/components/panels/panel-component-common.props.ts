import {NullableString} from "../../../../../framework/types/nullable-types";
import {UnderlyingActivePositionsModel} from "../../underlying-active-positions.model";

export interface PanelComponentCommonProps {
    expandedUnderlyingSymbol: NullableString;
    underlyingWithOpenPositions: UnderlyingActivePositionsModel[];
    onUnderlyingHeaderClick: (underlyingSymbol: string) => void;
}