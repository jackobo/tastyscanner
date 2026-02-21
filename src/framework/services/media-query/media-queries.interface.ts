export interface IMediaQueriesGeneric<T> {
    // ~~ VIEWPORT MEDIA QUERIES ~~

    /** XS (<360 px) */
    readonly xxs: T;

    readonly xsAndBelow: T;
    readonly xsExact: T;
    readonly xsAndAbove: T;

    /** S and below (<820) */
    readonly sAndBelow: T;

    /**same as sAndBelow*/
    readonly smallScreen: T;

    /** S (>=420px, <820x) */
    readonly sExact: T;

    /** S and above (>=420px) */
    readonly sAndAbove: T;

    /** M and below (<1024px) */
    readonly mAndBelow: T;
    /** M (>=768px, <1024px) */
    readonly mExact: T;
    /** M and above (>=768px) */
    readonly mAndAbove: T;

    /** L and below (<1280px) - this is the usual breakpoint for isMobile */
    readonly lAndBelow: T;
    /** L (>=1024px, <1280px) */
    readonly lExact: T;
    /** L and above (>=1024px) */
    readonly lAndAbove: T;

    /** XL and below (<1480px) */
    readonly xlAndBelow: T;
    /** XL (>=1280px, <1480px) */
    readonly xlExact: T;
    /** XL and above (>=1280px) */
    readonly xlAndAbove: T;

    /** XXL (>=1480px) */
    readonly xxl: T;

    /** Orientation portrait */
    readonly portrait: T;
    /** Orientation landscape */
    readonly landscape: T;

    readonly lowHeight: T;

    // ~~ INTERACTION MEDIA QUERIES ~~
    /** True if the primary input alows hovering */
    readonly hover: T;
    /** True if the primary input does not alows hovering */
    readonly hoverNone: T;

    /** True if any of the input mechanism alows hovering */
    readonly anyHover: T;
    /** True if none of input mechanism alows hovering */
    readonly anyHoverNone: T;

    /** True if a primary pointer input exists */
    readonly pointer: T;
    /** True if a primary pointer input exists and it's precision is high */
    readonly pointerFine: T;
    /** True if a primary pointer input exists and it's precision is low */
    readonly pointerCoarse: T;
    /** True if a primary pointer input does not exists */
    readonly pointerNone: T;

    /** True if any pointer input exists */
    readonly anyPointer: T;
    /** True if any of the available pointers has high precision */
    readonly anyPointerFine: T;
    /** True if any of the available pointers has low precision */
    readonly anyPointerCoarse: T;
    /** True if no pointer input exists */
    readonly anyPointerNone: T;
}

export type IMediaQueries = IMediaQueriesGeneric<string>;
export type IMediaChecks = IMediaQueriesGeneric<boolean>;
