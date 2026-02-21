import {IMediaChecks} from "../media-queries.interface";
import {makeObservable, observable, runInAction} from "mobx";
import {containerBreakpoints as breakpoints} from "../breakpoints";

export class ContainerMediaChecksStrategy implements IMediaChecks {
    constructor(private readonly screenMediaChecks: IMediaChecks) {
        makeObservable<this, '_width' | '_height'>(this, {
            _width: observable.ref,
            _height: observable.ref
        })
    }
    private _width: number = 0;
    private _height: number = 0;

    setSize(width: number, height: number) {
        runInAction(() => {
            this._width = width;
            this._height = height;
        })
    }

    get xxs(): boolean {
        return this._width <= breakpoints.xxsMax;
    }

    get xs(): boolean {
        return this._width <= breakpoints.xsMax;
    }

    get xsAndBelow(): boolean {
        return this._width <= breakpoints.xsMax;
    }

    get xsExact(): boolean {
        return this._width > breakpoints.xxsMax && this._width <= breakpoints.xsMax;
    }

    get xsAndAbove(): boolean {
        return this._width > breakpoints.xxsMax;
    }

    get sAndBelow(): boolean {
        return this._width <= breakpoints.sMax;
    }

    get smallScreen(): boolean {
        return this.sAndBelow;
    }

    get sExact(): boolean {
        return this._width > breakpoints.xsMax && this._width <= breakpoints.sMax;
    }

    get sAndAbove(): boolean {
        return this._width > breakpoints.xsMax;
    }

    get mAndBelow(): boolean {
        return this._width <= breakpoints.mMax;
    }

    get mExact(): boolean {
        return this._width > breakpoints.sMax && this._width <= breakpoints.mMax
    }

    get mAndAbove(): boolean {
        return this._width > breakpoints.sMax;
    }

    get lAndBelow(): boolean {
        return this._width <= breakpoints.lMax;
    }

    get lExact(): boolean {
        return this._width > breakpoints.mMax && this._width <= breakpoints.lMax;
    }

    get lAndAbove(): boolean {
        return this._width > breakpoints.mMax;
    }

    get xlAndBelow(): boolean {
        return this._width <= breakpoints.xlMax;
    }

    get xlExact(): boolean {
        return  this._width > breakpoints.lMax && this._width <= breakpoints.xlMax;
    }

    get xlAndAbove(): boolean {
        return this._width > breakpoints.lMax;
    }

    get xxl(): boolean {
        return this._width > breakpoints.xlMax;
    }

    get lowHeight(): boolean {
        return  this._height <= 667;
    }

    get landscape(): boolean {
        return this.screenMediaChecks.landscape;
    }

    get portrait(): boolean {
        return this.screenMediaChecks.portrait;
    }

    get hover(): boolean {
        return this.screenMediaChecks.hover;
    }
    get hoverNone(): boolean {
        return this.screenMediaChecks.hoverNone;
    }

    get anyHover(): boolean {
        return this.screenMediaChecks.anyHover;
    }

    get anyHoverNone(): boolean {
        return this.screenMediaChecks.anyHoverNone;
    }

    get pointer(): boolean {
        return this.screenMediaChecks.pointer;
    }

    get pointerCoarse(): boolean {
        return this.screenMediaChecks.pointerCoarse;
    }
    get pointerFine(): boolean {
        return this.screenMediaChecks.pointerFine;
    }

    get pointerNone(): boolean {
        return this.screenMediaChecks.pointerNone;
    }

    get anyPointer(): boolean {
        return this.screenMediaChecks.anyPointer;
    }
    get anyPointerCoarse(): boolean {
        return this.screenMediaChecks.anyPointerCoarse;
    }

    get anyPointerFine(): boolean {
        return this.screenMediaChecks.anyPointerFine;
    }

    get anyPointerNone(): boolean {
        return this.screenMediaChecks.anyPointerNone;
    }
}