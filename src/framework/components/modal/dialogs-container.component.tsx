import React from "react";
import {observer} from "mobx-react";
import {useFrameworkServices} from "../../hooks/use-framework-services.hook";

export const DialogsContainerComponent: React.FC = observer(() => {
    const services = useFrameworkServices();

    return (
        <>
            {services.dialog.currentOpenDialogs.map(modal => modal.render())}
        </>
    );
});
