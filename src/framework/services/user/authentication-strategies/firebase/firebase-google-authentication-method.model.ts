import {GoogleAuthenticationMethodBase} from "../../authentication-method/google-authentication-method-base.model";
import {Auth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, User} from "firebase/auth";
import {Check} from "../../../../utils/type-checking";
import {IFrameworkServiceFactory} from "../../../framework-service-factory.interface";




export class FirebaseGoogleAuthenticationMethodModel extends GoogleAuthenticationMethodBase {
    constructor(private readonly _auth: Auth, services: IFrameworkServiceFactory) {
        super(services);


    }

    private readonly _googleProvider = new GoogleAuthProvider();
    private _user: User | null = null;

    async login(): Promise<boolean> {

        const unsubscribe = onAuthStateChanged(this._auth, (user) => {
            this._user = user;
        })

        try {
            await signInWithPopup(this._auth, this._googleProvider);
            return !Check.isNullOrUndefined(this._user);
        } catch (err) {
            if((err as any)?.code !== 'auth/popup-closed-by-user') {
                this.services.logger.error('Firebase Google authentication failed: ', err);
            }
            return false;
        } finally {
            unsubscribe();
        }

    }

    async logout(): Promise<void> {
        await signOut(this._auth);
        this._user = null;
    }

}