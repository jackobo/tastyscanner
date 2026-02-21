import {IMediaQueries} from "../media-queries.interface";
import {ScreenMediaQueriesBreakpoints} from "../media-queries-breakpoints";


function screenMediaQueryFor(mediaBreakpoint: string): string {
    return `@media ${mediaBreakpoint}`;
}



export const ScreenMediaQueries = Object.keys(ScreenMediaQueriesBreakpoints).reduce((result: any, breakpointKey) => {
    result[breakpointKey] = screenMediaQueryFor(ScreenMediaQueriesBreakpoints[breakpointKey as keyof IMediaQueries])
    return result;
}, {}) as IMediaQueries;