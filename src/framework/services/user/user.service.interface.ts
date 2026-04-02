export interface IUserService {
    readonly isAuthenticated: boolean;
    login(): Promise<void>;
    logout(): Promise<void>;
}
