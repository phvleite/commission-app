import { useState } from "react";
import { formatDateFromDatabase } from "../../utils/formatDate";
import { formatCurrencyFromDatabase } from "../../utils/formatCurrency";
import { gerarTituloPeriodo } from "../../utils/gerarTituloPeriodo";

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
            const dados = await window.api.comissoes.listarPorPeriodoColaborador(
                dataInicial,
                dataFinal,
                colaboradorId
            );

            const resumoSetores = await window.api.comissoes.listarResumoSetoresColaboradorPeriodo(
                dataInicial,
                dataFinal,
                colaboradorId
            );
            
            return { dados, resumoSetores };
        } catch (e) {
            setErro("Erro ao buscar comissões do colaborador por período.");
            return null;
        } finally {
            setLoading(false);
        }
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
        agruparPorColaborador,
        calcularTotalGeral,
        gerarTituloPeriodo
    };
}
