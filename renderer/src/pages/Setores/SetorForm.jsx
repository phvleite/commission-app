import React, { useState } from "react";
import { useToast } from "../../components/ToastContext";

export default function SetorForm({ onSubmit }) {
    const { addToast } = useToast();

    const [nome, setNome] = useState("");
    const [percentual, setPercentual] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        if (!nome.trim()) {
            addToast("Informe o nome do setor.", "error");
            return;
        }

        if (!percentual) {
            addToast("Informe o percentual.", "error");
            return;
        }

        const valor = Number(percentual);

        if (isNaN(valor) || valor <= 0) {
            addToast("Percentual inválido.", "error");
            return;
        }

        onSubmit(nome.trim(), valor);

        setNome("");
        setPercentual("");

        addToast("Setor cadastrado com sucesso!", "success");
    }

    return (
        <form onSubmit={handleSubmit} className="form-card">
            <h3>Novo Setor</h3>

            <div className="form-group">
                <label>Nome:</label>
                <input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Vendas"
                    className="input"
                />
            </div>

            <div className="form-group">
                <label>Percentual (%):</label>
                <input
                    type="number"
                    value={percentual}
                    onChange={(e) => setPercentual(e.target.value)}
                    placeholder="Ex: 10"
                    className="input"
                />
            </div>

            <button type="submit" className="btn-primary">
                Cadastrar
            </button>
        </form>
    );
}
