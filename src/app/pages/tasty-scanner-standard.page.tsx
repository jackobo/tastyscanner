import React, {PropsWithChildren} from "react";
import {observer} from "mobx-react";
import {StandardPage} from "../../framework/pages/standard.page";
import {TastyScannerStandardPageHeaderComponent} from "./tasty-scanner-standard-page-header.component";

interface TastyScannerStandardPageProps extends PropsWithChildren {

}

export const TastyScannerStandardPage: React.FC<TastyScannerStandardPageProps> = observer((props) => {

    const renderHeader = () => {
        return (
            <TastyScannerStandardPageHeaderComponent/>
        )
    }

    return (
        <StandardPage renderHeader={renderHeader}>
            {props.children}
        </StandardPage>
    )
})