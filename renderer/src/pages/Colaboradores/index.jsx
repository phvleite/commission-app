import { useEffect, useState } from "react";
import ColaboradorForm from "./ColaboradorForm";
import ColaboradorList from "./ColaboradorList";

export default function ColaboradoresPage() {
    const [colaboradores, setColaboradores] = useState([]);
    const [setores, setSetores] = useState([]);

    const [filtroStatus, setFiltroStatus] = useState("ativo");
    const [ordenacao, setOrdenacao] = useState("nome");
    const [filtroSetor, setFiltroSetor] = useState("todos");

    const [mostrarForm, setMostrarForm] = useState(false);

    async function carregarSetores() {
        const data = await window.api.setores.listarTodos();
        setSetores(data.filter((s) => s[1] !== "MERITOCRACIA" && s[4] === 1));
    }

    async function carregarColaboradores() {
        const data = await window.api.colaboradores.listar({
            status: filtroStatus,
            ordem: ordenacao,
            setor: filtroSetor
        });

        setColaboradores(
            data.map(([id, nome, setor_id, setor_nome, data_admissao, data_demissao, ativo]) => ({
                id,
                nome,
                setor_id,
                setor_nome,
                data_admissao,
                data_demissao,
                ativo
            }))
        );
    }

    async function criarColaborador(colaborador) {
        await window.api.colaboradores.criar(colaborador);
        carregarColaboradores();
        setMostrarForm(false);
    }

    async function editarColaborador(id, colaboradorAtualizado) {
        await window.api.colaboradores.editar(id, colaboradorAtualizado);
        carregarColaboradores();
    }

    useEffect(() => {
        carregarSetores();
    }, []);

    useEffect(() => {
        carregarColaboradores();

        function atualizar() {
            carregarColaboradores();
        }

        window.addEventListener("colaboradores-atualizados", atualizar);
        return () => window.removeEventListener("colaboradores-atualizados", atualizar);
    }, [filtroStatus, ordenacao, filtroSetor]);

    return (
        <div className="page">

            <h2>Colaboradores</h2>

            <button
                className="btn-primary btn-new-setor"
                onClick={() => setMostrarForm(!mostrarForm)}
            >
                Novo Colaborador
            </button>

            {mostrarForm && (
                <div className="form-card card-anim show">
                    <ColaboradorForm
                        setores={setores}
                        onSubmit={criarColaborador}
                        onCancel={() => setMostrarForm(false)}
                    />
                </div>
            )}

            <div className="filters-row">

                <div>
                    <span className="filter-label">Filtrar por status:</span>
                    <div className="select-wrapper">
                        <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
                            <option value="ativo">Ativos</option>
                            <option value="inativo">Demitidos</option>
                            <option value="todos">Todos</option>
                        </select>
                    </div>
                </div>

                <div>
                    <span className="filter-label">Filtrar por setor:</span>
                    <div className="select-wrapper">
                        <select value={filtroSetor} onChange={(e) => setFiltroSetor(e.target.value)}>
                            <option value="todos">Todos</option>
                            {setores.map(([id, nome]) => (
                                <option key={id} value={id}>{nome}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <span className="filter-label">Ordenar por:</span>
                    <div className="select-wrapper">
                        <select value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)}>
                            <option value="nome">Nome</option>
                            <option value="setor">Setor + Nome</option>
                        </select>
                    </div>
                </div>

            </div>

            <hr />

            <ColaboradorList
                colaboradores={colaboradores}
                setores={setores}
                onEditar={editarColaborador}
            />
        </div>
    );
}
