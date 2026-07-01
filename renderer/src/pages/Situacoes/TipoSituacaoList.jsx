import { useState } from "react";

export default function TipoSituacaoList({ tipos, onEditar, onAtivar, onInativar }) {
    const [editId, setEditId] = useState(null);
    const [editDescricao, setEditDescricao] = useState("");

    function iniciarEdicao(id, descricao) {
        setEditId(id);
        setEditDescricao(descricao);
    }

    function salvar() {
        onEditar(editId, editDescricao);
        setEditId(null);
    }

    return (
        <ul>
            {tipos.map(([id, descricao, ativo]) => (
                <li key={id} style={{ marginBottom: 10 }}>
                    {editId === id ? (
                        <>
                            <input
                                value={editDescricao}
                                onChange={(e) => setEditDescricao(e.target.value)}
                            />
                            <button onClick={salvar}>Salvar</button>
                            <button onClick={() => setEditId(null)}>Cancelar</button>
                        </>
                    ) : (
                        <>
                            <strong style={{ color: ativo ? "#000" : "#999" }}>{descricao}</strong>

                            {ativo ? (
                                <>
                                    <button
                                        onClick={() => iniciarEdicao(id, descricao)}
                                        style={{ marginLeft: 10 }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => onInativar(id)}
                                        style={{ marginLeft: 10 }}
                                    >
                                        Inativar
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => onAtivar(id)} style={{ marginLeft: 10 }}>
                                    Ativar
                                </button>
                            )}
                        </>
                    )}
                </li>
            ))}
        </ul>
    );
}
