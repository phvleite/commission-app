// Converte YYYY-MM-DD → DD/MM/YYYY (para exibir na tela)
export function formatDateToBR(dateStr) {
    if (!dateStr) return "";

    const [yyyy, mm, dd] = dateStr.split("-");
    if (!yyyy || !mm || !dd) return dateStr;

    return `${dd}/${mm}/${yyyy}`;
}

// Converte DD/MM/YYYY → YYYY-MM-DD (para salvar no banco)
export function formatDateToISO(dateStr) {
    if (!dateStr) return "";

    const [dd, mm, yyyy] = dateStr.split("/");
    if (!dd || !mm || !yyyy) return dateStr;

    return `${yyyy}-${mm}-${dd}`;
}

// Garante que a data está no formato aceito pelo input type="date"
export function normalizeDateForInput(dateStr) {
    // Se já estiver no formato YYYY-MM-DD, retorna como está
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

    // Se estiver no formato DD/MM/YYYY, converte
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
        return formatDateToISO(dateStr);
    }

    return dateStr;
}

// Formata datas vindas do banco para exibição
export function formatDateFromDatabase(dateStr) {
    return formatDateToBR(dateStr);
}
