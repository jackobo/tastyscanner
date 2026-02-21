import {IRoute} from "./route.interface";

export interface IApplicationRoutesBase {
    matchLocation(pathName: string): IRoute | null;
    readonly home: IRoute;
}