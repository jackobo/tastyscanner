import React from "react";
import {observer} from "mobx-react";
import {TastyScannerStandardPage} from "../tasty-scanner-standard.page";

export const OpenPositionsPage: React.FC = observer(() => {


    return (
        <TastyScannerStandardPage>
            <div>
                Open positions page
            </div>
        </TastyScannerStandardPage>
    )
})