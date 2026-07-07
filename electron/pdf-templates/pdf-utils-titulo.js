import { formatDateToBR } from "./pdf-utils.js";

export function gerarTituloPeriodo(dataInicial, dataFinal) {
    if (!dataInicial || !dataFinal) {
        return "PERÍODO INVÁLIDO";
    }

    if (dataInicial === dataFinal) {
        return `COMISSÕES DO DIA ${formatDateToBR(dataInicial)}`;
    }

    const [yi, mi, di] = dataInicial.split("-");
    const [yf, mf, df] = dataFinal.split("-");

    const ultimoDiaMes = new Date(yi, mi, 0).getDate();

    if (di === "01" && df === String(ultimoDiaMes).padStart(2, "0") && mi === mf && yi === yf) {
        const nomeMes = [
            "JANEIRO",
            "FEVEREIRO",
            "MARÇO",
            "ABRIL",
            "MAIO",
            "JUNHO",
            "JULHO",
            "AGOSTO",
            "SETEMBRO",
            "OUTUBRO",
            "NOVEMBRO",
            "DEZEMBRO"
        ][Number(mi) - 1];

        return `COMISSÕES REF. ${nomeMes}/${yi}`;
    }

    return `COMISSÕES DE ${formatDateToBR(dataInicial)} À ${formatDateToBR(dataFinal)}`;
}
