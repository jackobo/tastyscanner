import React from "react";
import {observer} from "mobx-react";
import {IronCondorsPage} from "../strategies/iron-condors.page";
import {useServices} from "../../hooks/use-services.hook";
import {TastyGobyStandardPage} from "../tasty-goby-standard.page";

export const HomePage: React.FC = observer(() => {
    const services = useServices();
    if(services.user.isAuthenticated) {
        return (
            <IronCondorsPage/>
        )
    } else {
        return (
            <TastyGobyStandardPage>
                Home page content
            </TastyGobyStandardPage>
        );
    }
})