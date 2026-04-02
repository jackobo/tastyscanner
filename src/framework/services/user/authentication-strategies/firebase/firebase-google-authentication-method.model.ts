import {GoogleAuthenticationMethodBase} from "../../authentication-method/google-authentication-method-base.model";
import {Auth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, User, setPersistence, browserLocalPersistence} from "firebase/auth";
import {Check} from "../../../../utils/type-checking";
import {IFrameworkServiceFactory} from "../../../framework-service-factory.interface";
import {makeObservable, observable, runInAction} from "mobx";

export class FirebaseGoogleAuthenticationMethodModel extends GoogleAuthenticationMethodBase {
    constructor(private readonly _auth: Auth, services: IFrameworkServiceFactory) {
        super(services);
        void setPersistence(this._auth, browserLocalPersistence);

        this._user = this._auth.currentUser;

        makeObservable<this, '_user'>(this, {
            _user: observable.ref
        })

        onAuthStateChanged(this._auth, (user) => {
            this._setCurrentUser(user);
        });

    }


    private readonly _googleProvider = new GoogleAuthProvider();
    private _user: User | null = null;

    private _setCurrentUser(user: User | null): void {
        runInAction(() => {
            this._user = user;
        })

    }

    get id(): string {
        return "E0A7F79F-8BD8-4735-81A3-16B62658F440";
    }


    get isAuthenticated(): boolean {
        return !Check.isNullOrUndefined(this._user);
    }

    async login(): Promise<void> {

        try {
            await signInWithPopup(this._auth, this._googleProvider);
        } catch (err) {
            if((err as any)?.code !== 'auth/popup-closed-by-user') {
                this.services.logger.error('Firebase Google authentication failed: ', err);
            }

        }

    }

    async logout(): Promise<void> {
        await signOut(this._auth);
        this._setCurrentUser(null);
    }

}