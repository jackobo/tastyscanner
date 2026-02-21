import {containerBreakpoints, IBreakpoints, screenBreakpoints} from "./breakpoints";
import { IMediaQueries } from "./media-queries.interface";
import { MediaOrientation, MediaPointer, MediaQueryBuilder } from "./media-query-builder";



function mediaQueriesBreakpoints(breakpoints: IBreakpoints): IMediaQueries {
    const { xxsMax, xsMax, sMax, mMax, lMax, xlMax } = breakpoints;
    return {
        xxs: MediaQueryBuilder.For.maxWidth(xxsMax).build(),

        xsAndBelow: MediaQueryBuilder.For.maxWidth(xsMax).build(),

        xsExact: MediaQueryBuilder.For.minWidth(xxsMax).maxWidth(xsMax).build(),
        xsAndAbove: MediaQueryBuilder.For.minWidth(xsMax).build(),

        sAndBelow: MediaQueryBuilder.For.maxWidth(sMax).build(),
        smallScreen: MediaQueryBuilder.For.maxWidth(sMax).build(),
        sExact: MediaQueryBuilder.For.minWidth(xsMax).maxWidth(sMax).build(),
        sAndAbove: MediaQueryBuilder.For.minWidth(xsMax).build(),

        mAndBelow: MediaQueryBuilder.For.maxWidth(mMax).build(),
        mExact: MediaQueryBuilder.For.minWidth(sMax).maxWidth(mMax).build(),
        mAndAbove: MediaQueryBuilder.For.minWidth(sMax).build(),

        lAndBelow: MediaQueryBuilder.For.maxWidth(lMax).build(),
        lExact: MediaQueryBuilder.For.minWidth(mMax).maxWidth(lMax).build(),
        lAndAbove: MediaQueryBuilder.For.minWidth(mMax).build(),

        xlAndBelow: MediaQueryBuilder.For.maxWidth(xlMax).build(),
        xlExact: MediaQueryBuilder.For.minWidth(lMax).maxWidth(xlMax).build(),
        xlAndAbove: MediaQueryBuilder.For.minWidth(lMax).build(),

        xxl: MediaQueryBuilder.For.minWidth(xlMax).build(),

        portrait: MediaQueryBuilder.For.orientation(MediaOrientation.Portrait).build(),
        landscape: MediaQueryBuilder.For.orientation(MediaOrientation.Landscape).build(),

        lowHeight: MediaQueryBuilder.For.maxHeight(667).build(),

        hover: MediaQueryBuilder.For.hover(true).build(),
        hoverNone: MediaQueryBuilder.For.hover(false).build(),

        anyHover: MediaQueryBuilder.For.anyHover(true).build(),
        anyHoverNone: MediaQueryBuilder.For.anyHover(false).build(),

        pointer: MediaQueryBuilder.For.pointer().build(),
        pointerFine: MediaQueryBuilder.For.pointer(MediaPointer.Fine).build(),
        pointerCoarse: MediaQueryBuilder.For.pointer(MediaPointer.Coarse).build(),
        pointerNone: MediaQueryBuilder.For.pointer(MediaPointer.None).build(),

        anyPointer: MediaQueryBuilder.For.anyPointer().build(),
        anyPointerFine: MediaQueryBuilder.For.anyPointer(MediaPointer.Fine).build(),
        anyPointerCoarse: MediaQueryBuilder.For.anyPointer(MediaPointer.Coarse).build(),
        anyPointerNone: MediaQueryBuilder.For.anyPointer(MediaPointer.None).build()
    }
}


export const ScreenMediaQueriesBreakpoints = mediaQueriesBreakpoints(screenBreakpoints);
export const ContainerMediaQueriesBreakpoints = mediaQueriesBreakpoints(containerBreakpoints);