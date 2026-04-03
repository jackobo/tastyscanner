import React from "react";
import {observer} from "mobx-react";
import {PrimaryButton} from "../../../framework/components/buttons/primary-button";
import {useServices} from "../../hooks/use-services.hook";

export const LoginButtonComponent: React.FC = observer(() => {
    const services = useServices();
    const onClick = async () => {
        await services.user.login();
    }
    return (
        <PrimaryButton onClick={onClick}>
            Login
        </PrimaryButton>
    )
});