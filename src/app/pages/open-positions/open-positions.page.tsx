import React from "react";
import {observer} from "mobx-react";
import {StandardPage} from "../../../framework/pages/standard.page";
import {useServices} from "../../hooks/use-services.hook";
import {TastyScannerStandardPage} from "../tasty-scanner-standard.page";

export const OpenPositionsPage: React.FC = observer(() => {
    const services = useServices();

    return (
        <TastyScannerStandardPage renderHeader={() => services.language.translate("Open Positions")}>
            <div>
                Open positions page
            </div>
        </TastyScannerStandardPage>
    )
})