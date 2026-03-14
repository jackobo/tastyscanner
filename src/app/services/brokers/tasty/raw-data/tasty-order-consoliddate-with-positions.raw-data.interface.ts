import {ITastyOrderLegRawData, ITastyOrderRawData} from "./tasty-order.raw-data.interfaces";
import {ITastyActivePositionRawData} from "./tasty-active-position.raw-data.interface";

export interface ITastyLegConsolidatedWithPosition {
    leg: ITastyOrderLegRawData;
    position: ITastyActivePositionRawData;
}

export interface ITastyOrderConsolidatedWithPositions extends Omit<ITastyOrderRawData, 'legs'> {
    legs: ITastyLegConsolidatedWithPosition[];
}
