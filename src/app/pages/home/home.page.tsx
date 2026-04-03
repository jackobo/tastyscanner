import React from "react";
import {observer} from "mobx-react";
import {IronCondorsPage} from "../strategies/iron-condors.page";
import {useServices} from "../../hooks/use-services.hook";
import {PrimaryButton} from "../../../framework/components/buttons/primary-button";

export const HomePage: React.FC = observer(() => {
    const services = useServices();
    if(services.user.isAuthenticated) {
        return (
            <IronCondorsPage/>
        )
    } else {
        return (
            <PrimaryButton onClick={() => services.user.login()}>
                Log in
            </PrimaryButton>
        );
    }
})