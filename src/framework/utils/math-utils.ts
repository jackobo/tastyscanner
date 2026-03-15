export class MathUtils {
    static round(value: number, decimals: number = 2): number {
        if(decimals <  0) {
            throw new Error("Decimals cannot be negative");
        }
        return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
    }
}