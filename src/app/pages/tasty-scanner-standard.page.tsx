import React, {PropsWithChildren} from "react";
import {observer} from "mobx-react";
import {StandardPage} from "../../framework/pages/standard.page";
import {TastyScannerStandardPageHeaderComponent} from "./tasty-scanner-standard-page-header.component";
import {ThemeProvider} from "styled-components";
import {useServices} from "../hooks/use-services.hook";

interface TastyScannerStandardPageProps extends PropsWithChildren {

}

export const TastyScannerStandardPage: React.FC<TastyScannerStandardPageProps> = observer((props) => {
    const services = useServices();
    const renderHeader = () => {
        return (
            <TastyScannerStandardPageHeaderComponent/>
        )
    }

    return (
        <StandardPage renderHeader={renderHeader}>
            <ThemeProvider theme={services.theme.applyContainerMediaQueries()}>
                {props.children}
            </ThemeProvider>
        </StandardPage>
    )
})