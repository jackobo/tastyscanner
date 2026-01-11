export function calculatePOPWithIV(
    shortPutStrike: number,
    shortCallStrike: number,
    currentPrice: number,
    ivPut: number,
    ivCall: number,
    daysToExpiration: number,
    riskFreeRate: number = 0.04
): number {
    const T = daysToExpiration / 365; // Timpul în ani

    // Funcție auxiliară pentru calcularea d2
    const calculateD2 = (strike: number, iv: number): number => {
        return (
            (Math.log(currentPrice / strike) +
                (riskFreeRate - 0.5 * iv ** 2) * T) /
            (iv * Math.sqrt(T))
        );
    };

    // Calcul d2 pentru fiecare strike
    const d2Put = calculateD2(shortPutStrike, ivPut);
    const d2Call = calculateD2(shortCallStrike, ivCall);

    // Funcția de distribuție normală cumulativă (folosește o bibliotecă matematică)
    const N = (x: number): number =>
        0.5 * (1 + erf(x / Math.sqrt(2))); // Aplicație pentru distribuție normală

    // Calcul POP
    const pop = N(d2Call) - N(d2Put);

    return Math.min(1, pop); // Asigurăm că POP nu trece de 100%
}

function erf(x: number): number {
    // Constante pentru aproximarea funcției eroare
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    // Semnul lui x
    const sign = x < 0 ? -1 : 1;
    const absX = Math.abs(x);

    // Calculul funcției eroare (aproximare rapidă)
    const t = 1 / (1 + p * absX);
    const y =
        1 -
        (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

    return sign * y;
}

function normalCdf(x: number, mean = 0, stdDev = 1): number {
    const z = (x - mean) / stdDev;
    return (1 + erf(z / Math.sqrt(2))) / 2;
}

