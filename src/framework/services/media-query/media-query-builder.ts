export enum MediaType {
    All = "all",
    Screen = "screen",
    Print = "print",
    Speech = "speech",
    OnlyScreen = "only screen"
}
export enum MediaOrientation {
    Portrait = "portrait",
    Landscape = "landscape"
}
export enum MediaPointer {
    Fine = "fine",
    Coarse = "coarse",
    None = "none"
}

export class MediaQueryBuilder {
    static get For(): MediaQueryBuilder {
        return new MediaQueryBuilder();
    }
    private _rules: string[] = [];
    private _mediaType: MediaType | undefined;

    mediaType(m: MediaType): MediaQueryBuilder {
        this._mediaType = m;
        return this;
    }
    minWidth(w: number): MediaQueryBuilder {
        this._rules.push(`(min-width: ${w}px)`);
        return this;
    }
    maxWidth(w: number): MediaQueryBuilder {
        this._rules.push(`(max-width: ${w}px)`);
        return this;
    }
    minHeight(h: number): MediaQueryBuilder {
        this._rules.push(`(min-height: ${h}px)`);
        return this;
    }
    maxHeight(h: number): MediaQueryBuilder {
        this._rules.push(`(max-height: ${h}px)`);
        return this;
    }
    orientation(o: MediaOrientation): MediaQueryBuilder {
        this._rules.push(`(orientation: ${o})`);
        return this;
    }
    hover(t: boolean) {
        this._rules.push(`(hover: ${t ? 'hover' : 'none'})`);
        return this;
    }
    anyHover(t: boolean) {
        this._rules.push(`(any-hover: ${t ? 'hover' : 'none'})`);
        return this;
    }
    pointer(precision?: MediaPointer) {
        if (precision) {
            this._rules.push(`(pointer: ${precision})`);
        } else {
            this._rules.push(`(pointer)`);
        }
        return this;
    }
    anyPointer(precision?: MediaPointer) {
        if (precision) {
            this._rules.push(`(any-pointer: ${precision})`);
        } else {
            this._rules.push(`(any-pointer)`);
        }
        return this;
    }
    build(): string {
        let rules = [...this._rules];
        if (this._mediaType) {
            rules.unshift(this._mediaType);
        }
        return rules.join(' and ');
    }
}