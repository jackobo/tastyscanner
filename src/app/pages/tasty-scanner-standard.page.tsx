import React, {PropsWithChildren} from "react";
import {observer} from "mobx-react";
import {StandardPage} from "../../framework/pages/standard.page";
import {TastyScannerStandardPageHeaderComponent} from "./tasty-scanner-standard-page-header.component";

interface TastyScannerStandardPageProps extends PropsWithChildren {
    className?: string;
    pageContentCssClass?: string;
}

export const TastyScannerStandardPage: React.FC<TastyScannerStandardPageProps> = observer((props) => {

    const renderHeader = () => {
        return (
            <TastyScannerStandardPageHeaderComponent/>
        )
    }

    return (
        <StandardPage renderHeaderContent={renderHeader} className={props.className} pageContentCssClass={props.pageContentCssClass}>
            {props.children}
        </StandardPage>
    )
})