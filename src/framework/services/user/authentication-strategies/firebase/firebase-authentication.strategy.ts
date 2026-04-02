import {IUserAuthenticationStrategy} from "../user-authentication.strategy.interface";
import {FirebaseApp, initializeApp } from "firebase/app";
import {getAuth, Auth} from "firebase/auth";
import {IAuthenticationMethodModel} from "../../authentication-method/authentication-method.model.interface";
import {FirebaseGoogleAuthenticationMethodModel} from "./firebase-google-authentication-method.model";
import {IFrameworkServiceFactory} from "../../../framework-service-factory.interface";

const firebaseConfig = {
    apiKey: "AIzaSyDM9v1E0Dg5YsfwPIEbZ1b_DPZGNwaWb0U",
    authDomain: "tasty-goby.firebaseapp.com",
    projectId: "tasty-goby",
    storageBucket: "tasty-goby.firebasestorage.app",
    messagingSenderId: "58850703430",
    appId: "1:58850703430:web:69d992cc48d38783afb247",
    measurementId: "G-D55C4G08TS"
};


export class FirebaseAuthenticationStrategy implements IUserAuthenticationStrategy {
    constructor(services: IFrameworkServiceFactory) {
        this._firebaseApp = initializeApp(firebaseConfig);
        this._auth = getAuth(this._firebaseApp);
        this.authenticationMethods = [
            new FirebaseGoogleAuthenticationMethodModel(this._auth, services)
        ];
    }

    private readonly _firebaseApp: FirebaseApp;
    private readonly _auth: Auth;



    readonly authenticationMethods: IAuthenticationMethodModel[] = [];

}