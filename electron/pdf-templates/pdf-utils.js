function formatDateToBR(dateStr) {
    if (!dateStr) return "";

    const [yyyy, mm, dd] = dateStr.split("-");
    if (!yyyy || !mm || !dd) return dateStr;

    return `${dd}/${mm}/${yyyy}`;
}

function formatCurrencyBR(centavos) {
    const numberValue = Number(centavos) / 100;

    return new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(numberValue);
}

function formatCurrencyFromDatabase(centavos) {
    return formatCurrencyBR(centavos);
}

function formatDateFromDatabase(dateStr) {
    return formatDateToBR(dateStr);
}

