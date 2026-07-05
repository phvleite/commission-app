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
        <form className="tipo-form-card" onSubmit={handleSubmit}>
            <h3>Novo Tipo de Situação</h3>

            <div className="form-vertical">
                <input
                    className="input"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Ex: Férias, Folga, Atestado..."
                />

                <button className="btn-primary" type="submit">
                    Cadastrar
                </button>
            </div>
        </form>
    );
}
