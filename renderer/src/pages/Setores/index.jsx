import { useEffect, useState } from "react";
import SetorForm from "./SetorForm";
import SetorList from "./SetorList";

export default function SetoresPage() {
    const [setores, setSetores] = useState([]);

    async function carregarSetores() {
        const data = await window.api.setores.listarTodos();
        setSetores(data);
    }

    async function criarSetor(nome, percentual) {
        await window.api.setores.criar(nome, percentual);
        carregarSetores();
    }

    async function excluirSetor(id) {
        await window.api.setores.excluir(id);
        carregarSetores();
    }

    useEffect(() => {
        carregarSetores();

        // 🔥 Atualiza automaticamente quando setores mudam
        function atualizar() {
            carregarSetores();
        }

        window.addEventListener("setores-atualizados", atualizar);

        return () => {
            window.removeEventListener("setores-atualizados", atualizar);
        };
    }, []);

    const soma = setores
        .filter((s) => s[4] === 1) // soma apenas ativos
        .reduce((acc, setor) => acc + setor[2], 0);

    const somaOk = soma === 100;

    return (
        <div style={{ padding: 20 }}>
            <h1>Setores</h1>

            <SetorForm onSubmit={criarSetor} />

            <div style={{ marginTop: 20 }}>
                <strong>Soma dos percentuais: </strong>
                <span style={{ color: somaOk ? "green" : "red" }}>{soma}%</span>
            </div>

            <hr />

            <SetorList setores={setores} onExcluir={excluirSetor} onAtualizar={carregarSetores} />
        </div>
    );
}
