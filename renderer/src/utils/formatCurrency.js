// Para valores digitados pelo usuário
export function formatCurrencyInput(value) {
    const onlyNumbers = value.replace(/\D/g, "");

    if (!onlyNumbers) return "";

    const numberValue = Number(onlyNumbers) / 100;

    return new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(numberValue);
}

// Para valores vindos do banco (centavos → reais)
export function formatCurrencyFromDatabase(centavos) {
    const numberValue = centavos / 100;

    return new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(numberValue);
}

// Converte texto formatado para número (reais)
export function currencyToNumber(formatted) {
    if (!formatted) return 0;

    return Number(
        formatted
            .replace(/\./g, "")
            .replace(",", ".")
    );
}
