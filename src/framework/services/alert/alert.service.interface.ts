export interface IAlertService {
    showError(message: string): void;
    showErrorAsync(message: string): Promise<void>;
}
