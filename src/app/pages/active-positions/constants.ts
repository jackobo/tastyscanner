
export const UNDERLYING_SYMBOL_WIDTH = '160px';


// DTE / PL% / PL / Mrk / TrdPrc / Bid /Ask / chevron
export function getCommonColumnsTemplate(smallScreen: boolean) {
    if(smallScreen) {
        return '45px repeat(6, 80px)'
    }
    return 'repeat(7, 1fr)'
}