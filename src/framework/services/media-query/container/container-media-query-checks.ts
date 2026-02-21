import {IMediaChecks} from "../media-queries.interface";
import {ResizeObserver} from "@juggle/resize-observer";
import {ContainerMediaChecksStrategy} from "./container-media-queries.strategy";
import {makeObservable, observable, runInAction} from "mobx";


export class ContainerMediaQueryChecks implements IMediaChecks {
    constructor(screenMediaChecks: IMediaChecks) {

        this._currentStrategy = screenMediaChecks;
        this._containerMediaChecksStrategy = new ContainerMediaChecksStrategy(screenMediaChecks);

        this._resizeObserver = new ResizeObserver((entries) => {
            const el = entries[0].target;
            this._containerMediaChecksStrategy.setSize(el.clientWidth, el.clientHeight);
        });

        makeObservable<this, '_currentStrategy'>(this, {
            _currentStrategy: observable.ref
        })
    }

    private readonly _containerMediaChecksStrategy: ContainerMediaChecksStrategy;
    private _containerElement: HTMLElement | null = null;
    setElement(el: HTMLElement): void {
        this._resizeObserver.disconnect();
        this._containerElement = el;
        this._resizeObserver.observe(el);
        this._containerMediaChecksStrategy.setSize(el.clientWidth, el.clientHeight);
        runInAction(() => {
            this._currentStrategy = this._containerMediaChecksStrategy;
        });

    }

    dispose() {
        this._resizeObserver.disconnect();
    }

    private _currentStrategy: IMediaChecks;
    private get currentStrategy(): IMediaChecks {
        return this._currentStrategy;
    }

    private readonly _resizeObserver: ResizeObserver;

    get xxs(): boolean {
        return this.currentStrategy.xxs;
    }

    get xsAndBelow() {
        return this.currentStrategy.xsAndBelow;
    }

    get xsExact() {
        return this.currentStrategy.xsExact;
    }

    get xsAndAbove() {
        return this.currentStrategy.xsAndAbove;
    }

    get sAndAbove(): boolean {
        return this.currentStrategy.sAndAbove;
    }

    get sAndBelow(): boolean {
        return this.currentStrategy.sAndBelow;
    }

    get sExact(): boolean {
        return this.currentStrategy.sExact;
    }

    get smallScreen(): boolean {
        return this.currentStrategy.smallScreen;
    }

    get mAndAbove(): boolean {
        return this.currentStrategy.mAndAbove;
    }
    get mAndBelow(): boolean {
        return this.currentStrategy.mAndBelow;
    }

    get mExact(): boolean {
        return this.currentStrategy.mExact;
    }

    get lAndAbove(): boolean {
        return this.currentStrategy.lAndAbove;
    }

    get lAndBelow(): boolean {
        return this.currentStrategy.lAndBelow;
    }

    get lExact(): boolean {
        return this.currentStrategy.lExact;
    }

    get xlAndAbove(): boolean {
        return this.currentStrategy.xlAndAbove;
    }

    get xlAndBelow(): boolean {
        return this.currentStrategy.xlAndBelow;
    }

    get xlExact(): boolean {
        return this.currentStrategy.xlExact;
    }


    get xxl(): boolean {
        return this.currentStrategy.xxl;
    }


    get lowHeight(): boolean {
        return this.currentStrategy.lowHeight;
    }

    get landscape(): boolean {
        return this.currentStrategy.landscape;
    }


    get portrait(): boolean {
        return this.currentStrategy.portrait;
    }

    get pointer(): boolean {
        return this.currentStrategy.pointer;
    }

    get pointerCoarse(): boolean {
        return this.currentStrategy.pointerCoarse;
    }
    get pointerFine(): boolean {
        return this.currentStrategy.pointerFine;
    }

    get pointerNone(): boolean {
        return this.currentStrategy.pointerNone;
    }

    get anyPointer(): boolean {
        return this.currentStrategy.anyPointer;
    }
    get anyPointerCoarse(): boolean {
        return this.currentStrategy.anyPointerCoarse;
    }

    get anyPointerFine(): boolean {
        return this.currentStrategy.anyPointerFine;
    }

    get anyPointerNone(): boolean {
        return this.currentStrategy.anyPointerNone;
    }

    get hover(): boolean {
        return this.currentStrategy.hover;
    }
    get hoverNone(): boolean {
        return this.currentStrategy.hoverNone;
    }

    get anyHover(): boolean {
        return this.currentStrategy.anyHover;
    }

    get anyHoverNone(): boolean {
        return this.currentStrategy.anyHoverNone;
    }
}



