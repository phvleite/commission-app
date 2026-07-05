import { useState } from "react";
import { useToast } from "../../components/ToastContext";

export default function TipoSituacaoList({ tipos, onEditar, onAtivar, onInativar }) {
    const { addToast } = useToast();

    const [editId, setEditId] = useState(null);
    const [editDescricao, setEditDescricao] = useState("");

    function iniciarEdicao(id, descricao) {
        setEditId(id);
        setEditDescricao(descricao);
    }

    function salvar() {
        if (!editDescricao.trim()) {
            addToast("Informe a descrição.", "error");
            return;
        }

        onEditar(editId, editDescricao.trim());
        setEditId(null);

        addToast("Tipo de situação atualizado!", "success");
    }

    return (
        <div className="list-card">
            <h3>Tipos de Situação</h3>

            <div className="tipos-list">
                {tipos.map(([id, descricao, ativo]) => (
                    <div key={id} className="tipo-card">

                        {editId === id ? (
                            <>
                                <input
                                    className="input"
                                    value={editDescricao}
                                    onChange={(e) => setEditDescricao(e.target.value)}
                                    autoFocus
                                    style={{ flex: 1 }}
                                />

                                <div className="tipo-right">
                                    <button className="btn-primary" onClick={salvar}>
                                        Salvar
                                    </button>
                                    <button className="btn-secondary" onClick={() => setEditId(null)}>
                                        Cancelar
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="tipo-left">
                                    {descricao}
                                </div>

                                <div className="tipo-right">
                                    <button
                                        className="btn-primary"
                                        onClick={() => iniciarEdicao(id, descricao)}
                                    >
                                        Editar
                                    </button>

                                    {ativo === 1 ? (
                                        <button
                                            className="btn-danger"
                                            onClick={() => {
                                                onInativar(id);
                                                addToast("Tipo de situação inativado!", "success");
                                            }}
                                        >
                                            Inativar
                                        </button>
                                    ) : (
                                        <button
                                            className="btn-primary"
                                            onClick={() => {
                                                onAtivar(id);
                                                addToast("Tipo de situação ativado!", "success");
                                            }}
                                        >
                                            Ativar
                                        </button>
                                    )}
                                </div>
                            </>
                        )}

                    </div>
                ))}
            </div>
        </div>
    );
}
