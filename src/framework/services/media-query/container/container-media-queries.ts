import {IMediaQueries} from "../media-queries.interface";
import {ContainerMediaQueriesBreakpoints} from "../media-queries-breakpoints";

function containerMediaQueryFor(mediaBreakpoint: string): string {
    return `@container ${mediaBreakpoint}`;
}



export const ContainerMediaQueries = Object.keys(ContainerMediaQueriesBreakpoints).reduce((result: any, breakpointKey) => {
    result[breakpointKey] = containerMediaQueryFor(ContainerMediaQueriesBreakpoints[breakpointKey as keyof IMediaQueries]);
    return result;
}, {}) as IMediaQueries;