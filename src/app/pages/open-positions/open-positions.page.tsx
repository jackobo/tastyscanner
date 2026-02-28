import React, {useEffect} from "react";
import {observer} from "mobx-react";
import {TastyScannerStandardPage} from "../tasty-scanner-standard.page";
import {useServices} from "../../hooks/use-services.hook";

export const OpenPositionsPage: React.FC = observer(() => {


    const services = useServices();
    useEffect(() => {
        if(services.brokers.currentAccount) {

            /*
            services.brokers.currentAccount.getOpenPositions().then((data) => {
                const groupedBySymbol = data.groupByKey(item => item.underlyingSymbol);
                console.log(groupedBySymbol);
            })

             */

            services.brokers.currentAccount.getOpenPositions().then(positions => {
                //const groupedBySymbol = positions.groupByKey(item => item.underlyingSymbol);
                //console.log(groupedBySymbol);
            });


        }
    }, [services.brokers.currentAccount]);



    return (
        <TastyScannerStandardPage>
            <div>
                Open positions page
            </div>
        </TastyScannerStandardPage>
    )
})