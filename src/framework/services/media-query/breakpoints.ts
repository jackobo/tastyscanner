/** Upper limits (non-inclusive) for media breakpoints */
export interface IBreakpoints {
    xxsMax: number;
    xsMax: number;
    sMax: number;
    mMax: number;
    lMax: number;
    xlMax: number;
}
export const screenBreakpoints: IBreakpoints = {
    xxsMax: 360,
    xsMax: 440,
    sMax: 820,
    mMax: 1024,
    lMax: 1280,
    xlMax: 1480
};

export const containerBreakpoints: IBreakpoints = {
    xxsMax: 360,
    xsMax: 440,
    sMax: 640,
    mMax: 860,
    lMax: 1024,
    xlMax: 1280
};
