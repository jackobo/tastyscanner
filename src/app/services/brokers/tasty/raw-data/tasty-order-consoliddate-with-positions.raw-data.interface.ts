import {ITastyOrderLegRawData, ITastyOrderRawData} from "./tasty-order.raw-data.interfaces";
import {ITastyOpenPositionRawData} from "./tasty-open-position.raw-data.interface";

export interface ITastyLegConsolidatedWithPosition {
    leg: ITastyOrderLegRawData;
    position: ITastyOpenPositionRawData;
}

export interface ITastyOrderConsolidatedWithPositions extends Omit<ITastyOrderRawData, 'legs'> {
    legs: ITastyLegConsolidatedWithPosition[];
}
