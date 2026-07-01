import { useEffect, useState } from "react";
import ColaboradorForm from "./ColaboradorForm";
import ColaboradorList from "./ColaboradorList";

export default function ColaboradoresPage() {
    const [colaboradores, setColaboradores] = useState([]);
    const [setores, setSetores] = useState([]);

    const [filtroStatus, setFiltroStatus] = useState("ativo");
    const [ordenacao, setOrdenacao] = useState("nome");
    const [filtroSetor, setFiltroSetor] = useState("todos");

    async function carregarSetores() {
        const data = await window.api.setores.listarTodos();
        // remover MERITOCRACIA e setores inativos
        setSetores(data.filter((s) => s[1] !== "MERITOCRACIA" && s[4] === 1));
    }

    async function carregarColaboradores() {
        const data = await window.api.colaboradores.listar({
            status: filtroStatus,
            ordem: ordenacao,
            setor: filtroSetor
        });

        // ⭐ CONVERTE ARRAY → OBJETO (CORRIGE LISTAGEM E EDIÇÃO)
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
        <div style={{ padding: 20 }}>
            <h1>Colaboradores</h1>

            <ColaboradorForm setores={setores} onSubmit={criarColaborador} />

            <div style={{ marginTop: 20 }}>
                <strong>Filtrar por status: </strong>
                <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
                    <option value="ativo">Ativos</option>
                    <option value="inativo">Demitidos</option>
                    <option value="todos">Todos</option>
                </select>

                <strong style={{ marginLeft: 20 }}>Filtrar por setor: </strong>
                <select value={filtroSetor} onChange={(e) => setFiltroSetor(e.target.value)}>
                    <option value="todos">Todos</option>
                    {setores.map(([id, nome]) => (
                        <option key={id} value={id}>
                            {nome}
                        </option>
                    ))}
                </select>

                <strong style={{ marginLeft: 20 }}>Ordenar por: </strong>
                <select value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)}>
                    <option value="nome">Nome</option>
                    <option value="setor">Setor + Nome</option>
                </select>
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
