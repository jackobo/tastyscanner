// DTE / PL% / PL / Mrk / TrdPrc / Bid /Ask / chevron
export function getCommonColumnsTemplate(smallScreen: boolean) {
    if(smallScreen) {
        return '45px 60px 80px repeat(7, 60px)';
    }
    return 'repeat(10, 1fr)';
}