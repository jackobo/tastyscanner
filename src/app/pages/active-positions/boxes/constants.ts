
export const LEG_INFO_WIDTH = '220px';


// DTE / PL% / PL / Mrk / TrdPrc / Bid /Ask / chevron
export function getCommonColumnsTemplate(smallScreen: boolean) {
    if(smallScreen) {
        return 'repeat(7, 65px) 45px'
    }
    return 'repeat(7, 1fr) 45px'
}