import { useState, useEffect } from "react";
import { useToast } from "../../components/ToastContext.jsx";
import { useComissoes } from "./useComissoes.js";

import RelatorioPeriodoTodos from "./RelatorioPeriodoTodos.jsx";
import RelatorioPeriodoColaborador from "./RelatorioPeriodoColaborador.jsx";

export default function ComissoesPage() {
    const [dataInicial, setDataInicial] = useState("");
    const [dataFinal, setDataFinal] = useState("");
    const [colaboradorId, setColaboradorId] = useState("");

    const [colaboradores, setColaboradores] = useState([]);
    const [resultado, setResultado] = useState(null);

    const { addToast } = useToast();

    const { listarPorPeriodo, listarPorPeriodoColaborador } = useComissoes();

    // Carregar colaboradores
    useEffect(() => {
        async function carregarColaboradores() {
            const data = await window.api.colaboradores.listar({
                status: "todos",
                ordem: "nome",
                setor: "todos"
            });

            const lista = (data || []).map(
                ([id, nome, setor_id, setor_nome, data_admissao, data_demissao, ativo]) => ({
                    id,
                    nome,
                    setor_id,
                    setor_nome,
                    data_admissao,
                    data_demissao,
                    ativo
                })
            );

            setColaboradores(lista);
        }
        carregarColaboradores();
    }, []);

    function limparFiltros() {
        setDataInicial("");
        setDataFinal("");
        setColaboradorId("");
        setResultado(null);
    }

    async function gerarRelatorio() {
        // RELATÓRIO POR PERÍODO
        if (dataInicial && dataFinal) {
            if (dataFinal < dataInicial) {
                addToast("A data final não pode ser menor que a data inicial.", "error");
                return;
            }

            if (colaboradorId) {
                const dados = await listarPorPeriodoColaborador(
                    dataInicial,
                    dataFinal,
                    colaboradorId
                );

                if (!dados || !dados.dados || dados.dados.length === 0) {
                    addToast("Nenhum registro encontrado para o período informado.", "error");
                    return;
                }

                setResultado({
                    tipo: "periodo-colaborador",
                    dados,
                    dataInicial,
                    dataFinal,
                    colaboradorId
                });
            } else {
                const dados = await listarPorPeriodo(dataInicial, dataFinal);
                const vendasPeriodo = await window.api.vendas.listarPorPeriodo(
                    dataInicial,
                    dataFinal
                );

                if (!dados || !dados.dados || dados.dados.length === 0) {
                    addToast("Nenhum registro encontrado para o período informado.", "error");
                    return;
                }

                setResultado({
                    tipo: "periodo-todos",
                    dados,
                    dataInicial,
                    dataFinal,
                    vendasPeriodo
                });
            }
            return;
        }

        addToast("Selecione um período.", "error");
    }

    return (
        <div>
            <div className="venda-form-card">
                <h2>Comissões</h2>
                <hr />

                {/* FILTROS */}
                <div
                    className="situ-filters"
                    style={{ flexWrap: "nowrap", alignItems: "flex-end" }}
                >
                    <div className="situ-filter-group">
                        <label>Data Inicial</label>
                        <input
                            type="date"
                            value={dataInicial}
                            onChange={(e) => setDataInicial(e.target.value)}
                        />
                    </div>

                    <div className="situ-filter-group">
                        <label>Data Final</label>
                        <input
                            type="date"
                            value={dataFinal}
                            onChange={(e) => setDataFinal(e.target.value)}
                        />
                    </div>

                    <div className="situ-filter-group commission-colab">
                        <label>Colaborador</label>
                        <select
                            value={colaboradorId}
                            onChange={(e) => setColaboradorId(e.target.value)}
                        >
                            <option value="">Todos</option>
                            {colaboradores.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div style={{ marginTop: 10 }}>
                    <button className="btn-primary" onClick={gerarRelatorio}>
                        Gerar Relatório
                    </button>
                    <button className="btn-secondary" onClick={limparFiltros}>
                        Limpar Filtros
                    </button>
                </div>
            </div>

            {/* RENDERIZAÇÃO DO RELATÓRIO */}
            {resultado?.tipo === "periodo-todos" && <RelatorioPeriodoTodos resultado={resultado} />}

            {resultado?.tipo === "periodo-colaborador" && (
                <RelatorioPeriodoColaborador resultado={resultado} />
            )}
        </div>
    );
}
