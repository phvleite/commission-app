import { useState } from "react";
import { useToast } from "../../components/ToastContext";

export default function TipoSituacaoForm({ onSubmit }) {
    const { addToast } = useToast();

    const [descricao, setDescricao] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        if (!descricao.trim()) {
            addToast("Informe a descrição da situação.", "error");
            return;
        }

        onSubmit(descricao.trim());
        setDescricao("");

        addToast("Tipo de situação cadastrado!", "success");
    }

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
            <h3>Novo Tipo de Situação</h3>

            <input
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex: Férias, Folga, Atestado..."
            />

            <button style={{ marginLeft: 10 }}>Cadastrar</button>
        </form>
    );
}
