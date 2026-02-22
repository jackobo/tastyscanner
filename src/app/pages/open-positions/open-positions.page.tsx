import React from "react";
import {observer} from "mobx-react";
import {TastyScannerStandardPage} from "../tasty-scanner-standard.page";
import {useServices} from "../../hooks/use-services.hook";

export const OpenPositionsPage: React.FC = observer(() => {
    const services = useServices();
    /*
    useEffect(() => {
        if(services.brokers.currentAccount) {


            services.brokers.currentAccount.balanceAndPositions().then((data) => {
                console.log(data);
            })



        }
    }, [services.brokers.currentAccount]);

     */

    return (
        <TastyScannerStandardPage>
            <div>
                Open positions page
            </div>
        </TastyScannerStandardPage>
    )
})