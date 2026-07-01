import { useEffect, useState } from "react";
import { useToast } from "../../components/ToastContext.jsx"; // ⭐ IMPORTAR AQUI

import TipoSituacaoForm from "./TipoSituacaoForm";
import TipoSituacaoList from "./TipoSituacaoList";
import SituacaoForm from "./SituacaoForm";
import SituacaoList from "./SituacaoList";

export default function SituacoesPage() {
    const [tipos, setTipos] = useState([]);
    const [situacoes, setSituacoes] = useState([]);
    const [colaboradores, setColaboradores] = useState([]);
    const { addToast } = useToast(); // ⭐ USAR AQUI, DENTRO DO COMPONENTE

    // Filtros
    const [filtroColaborador, setFiltroColaborador] = useState("todos");
    const [filtroTipo, setFiltroTipo] = useState("todos");
    const [filtroDataInicial, setFiltroDataInicial] = useState("");
    const [filtroDataFinal, setFiltroDataFinal] = useState("");
    const [filtroMes, setFiltroMes] = useState("");
    const [filtroAno, setFiltroAno] = useState("");

    // ---------------------------------------------------------
    // CARREGAMENTO DE DADOS
    // ---------------------------------------------------------

    async function carregarTipos() {
        const data = await window.api.situacoes.listarTipos();
        setTipos(data);
    }

    async function carregarColaboradores() {
        const data = await window.api.colaboradores.listar({
            status: "ativo",
            ordem: "nome",
            setor: "todos"
        });
        setColaboradores(data);
    }

    async function carregarSituacoes() {
        let data = await window.api.situacoes.listarSituacoes();

        // FILTRO POR COLABORADOR
        if (filtroColaborador !== "todos") {
            data = data.filter((s) => s[3] === Number(filtroColaborador));
        }

        // FILTRO POR TIPO
        if (filtroTipo !== "todos") {
            data = data.filter((s) => s[5] === Number(filtroTipo));
        }

        // FILTRO POR PERÍODO
        if (filtroDataInicial) {
            data = data.filter((s) => s[1] >= filtroDataInicial);
        }
        if (filtroDataFinal) {
            data = data.filter((s) => s[2] <= filtroDataFinal);
        }

        // FILTRO POR MÊS
        if (filtroMes) {
            data = data.filter((s) => s[1].substring(5, 7) === filtroMes);
        }

        // FILTRO POR ANO
        if (filtroAno) {
            data = data.filter((s) => s[1].substring(0, 4) === filtroAno);
        }

        setSituacoes(data);
    }

    // ---------------------------------------------------------
    // CRUD TIPO DE SITUAÇÃO
    // ---------------------------------------------------------

    async function criarTipo(descricao) {
        await window.api.situacoes.criarTipo(descricao);
        carregarTipos();
    }

    async function editarTipo(id, descricao) {
        await window.api.situacoes.editarTipo(id, descricao);
        carregarTipos();
    }

    async function ativarTipo(id) {
        await window.api.situacoes.ativarTipo(id);
        carregarTipos();
    }

    async function inativarTipo(id) {
        await window.api.situacoes.inativarTipo(id);
        carregarTipos();
    }

    // ---------------------------------------------------------
    // CRUD SITUAÇÃO
    // ---------------------------------------------------------

    async function criarSituacao(dataInicial, dataFinal, colaboradorId, tipoId) {
        try {
            await window.api.situacoes.criarSituacao(dataInicial, dataFinal, colaboradorId, tipoId);
            carregarSituacoes();
        } catch (err) {
            addToast(err.message, "error");
        }
    }

    async function editarSituacao(id, dataInicial, dataFinal, colaboradorId, tipoId) {
        try {
            await window.api.situacoes.editarSituacao(
                id,
                dataInicial,
                dataFinal,
                colaboradorId,
                tipoId
            );
            carregarSituacoes();
        } catch (err) {
            addToast(err.message, "error");
        }
    }

    async function ativarSituacao(id) {
        await window.api.situacoes.ativarSituacao(id);
        carregarSituacoes();
    }

    async function inativarSituacao(id) {
        await window.api.situacoes.inativarSituacao(id);
        carregarSituacoes();
    }

    // ---------------------------------------------------------
    // USE EFFECTS
    // ---------------------------------------------------------

    useEffect(() => {
        carregarTipos();
        carregarColaboradores();
    }, []);

    useEffect(() => {
        carregarSituacoes();
    }, [filtroColaborador, filtroTipo, filtroDataInicial, filtroDataFinal, filtroMes, filtroAno]);

    return (
        <div style={{ padding: 20 }}>
            <h1>Situações</h1>

            {/* ---------------------------------------------------------
                TIPOS DE SITUAÇÃO
            --------------------------------------------------------- */}
            <section style={{ marginBottom: 40 }}>
                <h2>Tipos de Situação</h2>

                <TipoSituacaoForm onSubmit={criarTipo} />

                <TipoSituacaoList
                    tipos={tipos}
                    onEditar={editarTipo}
                    onAtivar={ativarTipo}
                    onInativar={inativarTipo}
                />
            </section>

            <hr />

            {/* ---------------------------------------------------------
                SITUAÇÕES
            --------------------------------------------------------- */}
            <section style={{ marginTop: 40 }}>
                <h2>Cadastro de Situação</h2>

                {/* BLOQUEIO SE NÃO EXISTE TIPO ATIVO */}
                {tipos.filter((t) => t[2] === 1).length === 0 ? (
                    <div style={{ color: "red", marginBottom: 20 }}>
                        ⚠ Não é possível cadastrar uma Situação porque não existe nenhum Tipo de
                        Situação ativo.
                        <br />
                        Cadastre um Tipo de Situação acima.
                    </div>
                ) : (
                    <SituacaoForm
                        colaboradores={colaboradores}
                        tipos={tipos.filter((t) => t[2] === 1)}
                        onSubmit={criarSituacao}
                    />
                )}

                {/* FILTROS */}
                <div style={{ marginTop: 20 }}>
                    <strong>Colaborador: </strong>
                    <select
                        value={filtroColaborador}
                        onChange={(e) => setFiltroColaborador(e.target.value)}
                    >
                        <option value="todos">Todos</option>
                        {colaboradores.map(([id, nome]) => (
                            <option key={id} value={id}>
                                {nome}
                            </option>
                        ))}
                    </select>

                    <strong style={{ marginLeft: 20 }}>Tipo: </strong>
                    <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                        <option value="todos">Todos</option>
                        {tipos.map(([id, descricao]) => (
                            <option key={id} value={id}>
                                {descricao}
                            </option>
                        ))}
                    </select>

                    <strong style={{ marginLeft: 20 }}>Data inicial: </strong>
                    <input
                        type="date"
                        value={filtroDataInicial}
                        onChange={(e) => setFiltroDataInicial(e.target.value)}
                    />

                    <strong style={{ marginLeft: 20 }}>Data final: </strong>
                    <input
                        type="date"
                        value={filtroDataFinal}
                        onChange={(e) => setFiltroDataFinal(e.target.value)}
                    />

                    <strong style={{ marginLeft: 20 }}>Mês: </strong>
                    <select value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)}>
                        <option value="">Todos</option>
                        <option value="01">Jan</option>
                        <option value="02">Fev</option>
                        <option value="03">Mar</option>
                        <option value="04">Abr</option>
                        <option value="05">Mai</option>
                        <option value="06">Jun</option>
                        <option value="07">Jul</option>
                        <option value="08">Ago</option>
                        <option value="09">Set</option>
                        <option value="10">Out</option>
                        <option value="11">Nov</option>
                        <option value="12">Dez</option>
                    </select>

                    <strong style={{ marginLeft: 20 }}>Ano: </strong>
                    <select value={filtroAno} onChange={(e) => setFiltroAno(e.target.value)}>
                        <option value="">Todos</option>
                        {Array.from(new Set(situacoes.map((s) => s[1].substring(0, 4)))).map(
                            (ano) => (
                                <option key={ano} value={ano}>
                                    {ano}
                                </option>
                            )
                        )}
                    </select>
                </div>

                <SituacaoList
                    situacoes={situacoes}
                    colaboradores={colaboradores}
                    tipos={tipos}
                    onEditar={editarSituacao}
                    onAtivar={ativarSituacao}
                    onInativar={inativarSituacao}
                />
            </section>
        </div>
    );
}
