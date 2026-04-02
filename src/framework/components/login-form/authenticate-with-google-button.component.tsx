import React from "react";
import {observer} from "mobx-react";
import GoogleButton from "react-google-button";

interface AuthenticateWithGoogleButtonProps {
    onClick: () => void;
}
export const AuthenticateWithGoogleButton: React.FC<AuthenticateWithGoogleButtonProps> = observer((props) => {
    return <GoogleButton onClick={props.onClick}/>;
})