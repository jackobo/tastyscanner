// DTE / PL% / PL / Mrk / TrdPrc / Bid /Ask / chevron
export function getCommonColumnsTemplate(smallScreen: boolean) {
    if(smallScreen) {
        return '45px 60px 80px repeat(6, 60px)';
    }
    return 'repeat(9, 1fr)';
}