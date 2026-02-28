import {ITastyAccountOrderLegRawData, ITastyAccountOrderRawData} from "./tasty-order.raw-data.interfaces";
import {ITastyOpenPositionRawData} from "./tasty-open-position.raw-data.interface";

export interface ITastyLegConsolidatedWithPosition {
    leg: ITastyAccountOrderLegRawData;
    position: ITastyOpenPositionRawData;
}

export interface ITastyOrderConsolidatedWithPositions extends Omit<ITastyAccountOrderRawData, 'legs'> {
    legs: ITastyLegConsolidatedWithPosition[];
}
