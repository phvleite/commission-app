export function formatCurrency(value) {
    // Remove tudo que não for número
    const onlyNumbers = value.replace(/\D/g, "");

    // Se estiver vazio, retorna vazio
    if (!onlyNumbers) return "";

    // Converte para número e divide por 100 para ter centavos
    const numberValue = (Number(onlyNumbers) / 100).toFixed(2);

    // Formata para BRL
    return new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(numberValue);
}

export function currencyToNumber(formatted) {
    if (!formatted) return 0;

    return Number(
        formatted
            .replace(/\./g, "")
            .replace(",", ".")
    );
}
