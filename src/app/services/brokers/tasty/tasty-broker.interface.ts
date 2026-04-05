import {IBroker} from "../interfaces/broker.interface";
import {IMarketDataProvider} from "../../market-data-provider/market-data-provider.service.interface";

export interface ITastyBroker extends IBroker, IMarketDataProvider {

}