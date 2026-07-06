import { useState } from "react";
import { formatDateFromDatabase } from "../../utils/formatDate";
import { formatCurrencyFromDatabase } from "../../utils/formatCurrency";

export function useComissoes() {
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);

    async function listarPorPeriodo(dataInicial, dataFinal) {
        setLoading(true);
        setErro(null);
        try {
            const dados = await window.api.comissoes.listarPorPeriodo(dataInicial, dataFinal);
            const resumoSetores = await window.api.comissoes.listarResumoSetoresPorPeriodo(dataInicial, dataFinal);
            return { dados, resumoSetores };
        } catch (e) {
            setErro("Erro ao buscar comissões por período.");
            return null;
        } finally {
            setLoading(false);
        }
    }

    async function listarPorPeriodoColaborador(dataInicial, dataFinal, colaboradorId) {
        setLoading(true);
        setErro(null);
        try {
            const dados = await window.api.comissoes.listarPorPeriodoColaborador(dataInicial, dataFinal, colaboradorId);
            const resumoSetor = await window.api.comissoes.listarResumoSetoresColaboradorPeriodo(dataInicial, dataFinal, colaboradorId);
            return { dados, resumoSetor };
        } catch (e) {
            setErro("Erro ao buscar comissões do colaborador por período.");
            return null;
        } finally {
            setLoading(false);
        }
    }

    async function listarMensalTodos(mes, ano) {
        setLoading(true);
        setErro(null);
        try {
            const dados = await window.api.comissoes.listarMensalTodos(mes, ano);
            const resumoSetores = await window.api.comissoes.listarResumoSetoresMensal(mes, ano);
            return { dados, resumoSetores };
        } catch (e) {
            setErro("Erro ao buscar comissões mensais.");
            return null;
        } finally {
            setLoading(false);
        }
    }

    async function listarMensalColaborador(mes, ano, colaboradorId) {
        setLoading(true);
        setErro(null);
        try {
            const dados = await window.api.comissoes.listarMensalColaborador(mes, ano, colaboradorId);
            const resumoSetor = await window.api.comissoes.listarResumoSetoresColaboradorMensal(mes, ano, colaboradorId);
            return { dados, resumoSetor };
        } catch (e) {
            setErro("Erro ao buscar comissões mensais do colaborador.");
            return null;
        } finally {
            setLoading(false);
        }
    }

    function gerarTituloPeriodoTodos(dataInicial, dataFinal) {
        if (dataInicial === dataFinal) {
            return `COMISSÕES DE ${formatDateFromDatabase(dataInicial)}`;
        }
        return `COMISSÕES DE ${formatDateFromDatabase(dataInicial)} À ${formatDateFromDatabase(dataFinal)}`;
    }

    function gerarTituloPeriodoColaborador(nome, dataInicial, dataFinal) {
        if (dataInicial === dataFinal) {
            return `COMISSÕES ${nome} EM ${formatDateFromDatabase(dataInicial)}`;
        }
        return `COMISSÕES ${nome} NO PERÍODO DE ${formatDateFromDatabase(dataInicial)} À ${formatDateFromDatabase(dataFinal)}`;
    }

    function gerarTituloMensalTodos(mesLabel, ano) {
        return `COMISSÕES REF. ${mesLabel}/${ano}`;
    }

    function gerarTituloMensalColaborador(nome, mesLabel, ano) {
        return `COMISSÕES ${nome} EM ${mesLabel}/${ano}`;
    }

    function agruparPorColaborador(dados) {
        const mapa = new Map();

        dados.forEach((row) => {
            const chave = row.colaborador;
            const atual = mapa.get(chave) || {
                colaborador: row.colaborador,
                setor: row.setor,
                totalComissao: 0
            };
            atual.totalComissao += row.valor_colaborador;
            mapa.set(chave, atual);
        });

        return Array.from(mapa.values());
    }

    function calcularTotalGeral(dados) {
        return dados.reduce((acc, row) => acc + row.valor_colaborador, 0);
    }

    return {
        loading,
        erro,
        listarPorPeriodo,
        listarPorPeriodoColaborador,
        listarMensalTodos,
        listarMensalColaborador,
        gerarTituloPeriodoTodos,
        gerarTituloPeriodoColaborador,
        gerarTituloMensalTodos,
        gerarTituloMensalColaborador,
        agruparPorColaborador,
        calcularTotalGeral
    };
}
