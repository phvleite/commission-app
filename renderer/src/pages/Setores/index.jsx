import React, { useEffect, useState } from "react";
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

        function atualizar() {
            carregarSetores();
        }

        window.addEventListener("setores-atualizados", atualizar);
        return () => window.removeEventListener("setores-atualizados", atualizar);
    }, []);

    const soma = setores
        .filter((s) => s[4] === 1)
        .reduce((acc, setor) => acc + setor[2], 0);

    const somaOk = soma === 100;

    return (
        <div className="page">
            <h2>Setores</h2>

            <SetorForm onSubmit={criarSetor} />

            <div className="info-line">
                <strong>Soma dos percentuais:</strong>
                <span className={somaOk ? "text-success" : "text-danger"}>
                    {soma}%
                </span>
            </div>

            <hr className="gold-line" />

            <SetorList
                setores={setores}
                onExcluir={excluirSetor}
                onAtualizar={carregarSetores}
            />
        </div>
    );
}
