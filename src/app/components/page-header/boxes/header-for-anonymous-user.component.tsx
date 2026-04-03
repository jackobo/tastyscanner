import React from "react";
import {observer} from "mobx-react";
import {HeaderContainerBox} from "./header-container.box";
import {LeftSideContainerBox} from "./left-side-container.box";
import {AppLogo} from "../../logo/app-logo.component";
import {AppTitleComponent} from "./app-title.component";
import {LoginButtonComponent} from "../../login/login-button.component";

export const HeaderForAnonymousUserComponent: React.FC = observer(() => {

    return (
        <HeaderContainerBox>
            <LeftSideContainerBox>
                <AppLogo/>
                <AppTitleComponent/>
            </LeftSideContainerBox>

            <LoginButtonComponent/>

        </HeaderContainerBox>
    )
})