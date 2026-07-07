import { formatDateToBR } from "./formatDate";

export function gerarTituloPeriodoColaborador(nome, dataInicial, dataFinal) {
    if (!dataInicial || !dataFinal) {
        return `COMISSÕES DE ${nome} — PERÍODO INVÁLIDO`;
    }

    // mesmo dia
    if (dataInicial === dataFinal) {
        return `COMISSÕES DE ${nome} — DIA ${formatDateToBR(dataInicial)}`;
    }

    // mês completo
    const [yi, mi, di] = dataInicial.split("-");
    const [yf, mf, df] = dataFinal.split("-");

    const ultimoDiaMes = new Date(yi, mi, 0).getDate();

    if (
        di === "01" &&
        df === String(ultimoDiaMes).padStart(2, "0") &&
        mi === mf &&
        yi === yf
    ) {
        const nomeMes = [
            "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
            "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
        ][Number(mi) - 1];

        return `COMISSÕES DE ${nome} — REF. ${nomeMes}/${yi}`;
    }

    // período comum
    return `COMISSÕES DE ${nome} — ${formatDateToBR(dataInicial)} À ${formatDateToBR(dataFinal)}`;
}
