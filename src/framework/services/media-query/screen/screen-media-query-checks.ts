import { MediaQueryListener } from "./media-query-listener";

import { IMediaChecks, IMediaQueriesGeneric } from "../media-queries.interface";
import {ScreenMediaQueriesBreakpoints} from "../media-queries-breakpoints";

type IMediaListeners = IMediaQueriesGeneric<MediaQueryListener>;

export class ScreenMediaQueryChecks implements IMediaChecks {
    private mediaQueryListeners: IMediaListeners;

    constructor() {

        const tempRecords: any = {};
        Object.keys(ScreenMediaQueriesBreakpoints).forEach((mediaType) => {
            tempRecords[mediaType] = new MediaQueryListener(ScreenMediaQueriesBreakpoints[mediaType as keyof IMediaListeners]);
        });
        this.mediaQueryListeners = tempRecords as IMediaListeners;
    }

    get xxs() {
        return this.mediaQueryListeners.xxs.isMatched;
    }

    get xsAndBelow() {
        return this.mediaQueryListeners.xsAndBelow.isMatched;
    }

    get xsExact() {
        return this.mediaQueryListeners.xsExact.isMatched;
    }

    get xsAndAbove() {
        return this.mediaQueryListeners.xsAndAbove.isMatched;
    }

    get sAndBelow() {
        return this.mediaQueryListeners.sAndBelow.isMatched;
    }

    get smallScreen() {
        return this.mediaQueryListeners.smallScreen.isMatched;
    }

    get sExact() {
        return this.mediaQueryListeners.sExact.isMatched;
    }
    get sAndAbove() {
        return this.mediaQueryListeners.sAndAbove.isMatched;
    }
    get mAndBelow() {
        return this.mediaQueryListeners.mAndBelow.isMatched;
    }
    get mExact() {
        return this.mediaQueryListeners.mExact.isMatched;
    }
    get mAndAbove() {
        return this.mediaQueryListeners.mAndAbove.isMatched;
    }
    get lAndBelow() {
        return this.mediaQueryListeners.lAndBelow.isMatched;
    }
    get lExact() {
        return this.mediaQueryListeners.lExact.isMatched;
    }
    get lAndAbove() {
        return this.mediaQueryListeners.lAndAbove.isMatched;
    }
    get xlAndBelow() {
        return this.mediaQueryListeners.xlAndBelow.isMatched;
    }
    get xlExact() {
        return this.mediaQueryListeners.xlExact.isMatched;
    }
    get xlAndAbove() {
        return this.mediaQueryListeners.xlAndAbove.isMatched;
    }
    get xxl() {
        return this.mediaQueryListeners.xxl.isMatched;
    }
    get portrait() {
        return this.mediaQueryListeners.portrait.isMatched;
    }
    get landscape() {
        return this.mediaQueryListeners.landscape.isMatched;
    }
    get lowHeight() {
        return this.mediaQueryListeners.lowHeight.isMatched;
    }

    get hover() {
        return this.mediaQueryListeners.hover.isMatched;
    }
    get hoverNone() {
        return this.mediaQueryListeners.hoverNone.isMatched;
    }

    get anyHover() {
        return this.mediaQueryListeners.anyHover.isMatched;
    }
    get anyHoverNone() {
        return this.mediaQueryListeners.anyHoverNone.isMatched;
    }

    get pointer() {
        return this.mediaQueryListeners.pointer.isMatched;
    }
    get pointerFine() {
        return this.mediaQueryListeners.pointerFine.isMatched;
    }
    get pointerCoarse() {
        return this.mediaQueryListeners.pointerCoarse.isMatched;
    }
    get pointerNone() {
        return this.mediaQueryListeners.pointerNone.isMatched;
    }

    get anyPointer() {
        return this.mediaQueryListeners.anyPointer.isMatched;
    }
    get anyPointerFine() {
        return this.mediaQueryListeners.anyPointerFine.isMatched;
    }
    get anyPointerCoarse() {
        return this.mediaQueryListeners.anyPointerCoarse.isMatched;
    }
    get anyPointerNone() {
        return this.mediaQueryListeners.anyPointerNone.isMatched;
    }
}
