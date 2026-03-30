
export const UNDERLYING_SYMBOL_WIDTH = '160px';


// DTE / PL% / PL / Mrk / TrdPrc / Bid /Ask / chevron
export function getCommonColumnsTemplate(smallScreen: boolean) {
    if(smallScreen) {
        return '45px 60px 80px repeat(4, 60px)'
    }
    return 'repeat(7, 1fr)'
}