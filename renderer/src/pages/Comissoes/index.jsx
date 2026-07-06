import { useState, useEffect } from "react";
import ComissaoList from "./ComissaoList.jsx";
import { useToast } from "../../components/ToastContext.jsx";

export default function ComissoesPage() {
    const [dataInicial, setDataInicial] = useState("");
    const [dataFinal, setDataFinal] = useState("");
    const [mes, setMes] = useState("");
    const [ano, setAno] = useState("");
    const [colaboradorId, setColaboradorId] = useState("");

    const [colaboradores, setColaboradores] = useState([]);

    const [resultado, setResultado] = useState(null);

    const { addToast } = useToast();

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
        setMes("");
        setAno("");
        setColaboradorId("");
        setResultado(null);
    }

    async function gerarRelatorio() {
        // 1) RELATÓRIO POR MÊS/ANO
        if (mes && ano) {
            if (colaboradorId) {
                const dados = await window.api.comissoes.listarMensalColaborador(
                    mes,
                    ano,
                    colaboradorId
                );
                setResultado({ tipo: "mensal-colaborador", dados, mes, ano });
            } else {
                const dados = await window.api.comissoes.listarMensalTodos(mes, ano);
                setResultado({ tipo: "mensal-todos", dados, mes, ano });
            }
            return;
        }

        // 2) RELATÓRIO POR PERÍODO
        if (dataInicial && dataFinal) {
            if (colaboradorId) {
                const dados = await window.api.comissoes.listarPorPeriodoColaborador(
                    dataInicial,
                    dataFinal,
                    colaboradorId
                );
                setResultado({ tipo: "periodo-colaborador", dados, dataInicial, dataFinal });
            } else {
                const dados = await window.api.comissoes.listarPorPeriodo(dataInicial, dataFinal);
                setResultado({ tipo: "periodo-todos", dados, dataInicial, dataFinal });
            }
            return;
        }

        addToast("Selecione período ou mês/ano.", "error");
    }

    return (
        <div className="page">
            <h2>Comissões</h2>
            <hr />

            {/* FILTROS PREMIUM */}
            <div className="situ-filters">
                {/* PERÍODO */}
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

                {/* MÊS */}
                <div className="situ-filter-group">
                    <label>Mês</label>
                    <select value={mes} onChange={(e) => setMes(e.target.value)}>
                        <option value="">Todos</option>
                        <option value="01">Janeiro</option>
                        <option value="02">Fevereiro</option>
                        <option value="03">Março</option>
                        <option value="04">Abril</option>
                        <option value="05">Maio</option>
                        <option value="06">Junho</option>
                        <option value="07">Julho</option>
                        <option value="08">Agosto</option>
                        <option value="09">Setembro</option>
                        <option value="10">Outubro</option>
                        <option value="11">Novembro</option>
                        <option value="12">Dezembro</option>
                    </select>
                </div>

                {/* ANO */}
                <div className="situ-filter-group">
                    <label>Ano</label>
                    <select value={ano} onChange={(e) => setAno(e.target.value)}>
                        <option value="">Todos</option>
                        {Array.from({ length: 10 }).map((_, i) => {
                            const y = 2020 + i;
                            return (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            );
                        })}
                    </select>
                </div>

                {/* COLABORADOR */}
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

            {/* BOTÕES */}
            <div style={{ marginTop: 10 }}>
                <button className="btn-primary" onClick={gerarRelatorio}>
                    Gerar Relatório
                </button>
                <button className="btn-secondary" onClick={limparFiltros}>
                    Limpar Filtros
                </button>
            </div>

            {/* RESULTADO */}
            {resultado && <ComissaoList resultado={resultado} />}
        </div>
    );
}
