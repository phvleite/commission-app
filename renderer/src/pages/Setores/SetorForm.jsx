import { useState } from "react";
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
            addToast("Percentual inválido. Informe um valor maior que zero.", "error");
            return;
        }

        onSubmit(nome.trim(), valor);

        setNome("");
        setPercentual("");

        addToast("Setor cadastrado com sucesso!", "success");
    }

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
            <h3>Novo Setor</h3>

            <div>
                <label>Nome:</label>
                <br />
                <input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Vendas"
                />
            </div>

            <div>
                <label>Percentual (%):</label>
                <br />
                <input
                    type="number"
                    value={percentual}
                    onChange={(e) => setPercentual(e.target.value)}
                    placeholder="Ex: 10"
                />
            </div>

            <button type="submit" style={{ marginTop: 10 }}>
                Cadastrar
            </button>
        </form>
    );
}
