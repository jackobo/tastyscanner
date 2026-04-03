import React, {PropsWithChildren} from "react";
import {observer} from "mobx-react";
import {StandardPage} from "../../framework/pages/standard.page";
import {TastyGobyStandardPageHeaderComponent} from "../components/page-header/tasty-goby-standard-page-header.component";
import {useScreenMediaQueriesChecks} from "../../framework/hooks/use-screen-media-queries-checks.hook";

interface TastyGobyStandardPageProps extends PropsWithChildren {
    className?: string;
    pageContentCssClass?: string;
    pageContentWrapperCssClass?: string;
}

export const TastyGobyStandardPage: React.FC<TastyGobyStandardPageProps> = observer((props) => {
    const screenMediaQuery = useScreenMediaQueriesChecks();
    const renderHeader = () => {
        return (
            <TastyGobyStandardPageHeaderComponent/>
        )
    }

    const renderFooter = () => {
        if(!screenMediaQuery.smallScreen) {
            return null;
        }
        return (
            <div>Footer content</div>
        )
    }

    return (
        <StandardPage renderHeaderContent={renderHeader}
                      renderFooterContent={renderFooter}
                      className={props.className}
                      pageContentCssClass={props.pageContentCssClass}
                      pageContentWrapperCssClass={props.pageContentWrapperCssClass}>
            {props.children}
        </StandardPage>
    )
})