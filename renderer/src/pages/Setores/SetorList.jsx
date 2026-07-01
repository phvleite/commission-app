import { useState } from "react";

export default function SetorList({ setores, onExcluir, onAtualizar }) {
    const [editandoId, setEditandoId] = useState(null);
    const [editNome, setEditNome] = useState("");
    const [editPercentual, setEditPercentual] = useState("");

    function iniciarEdicao(id, nome, percentual) {
        setEditandoId(id);
        setEditNome(nome);
        setEditPercentual(percentual);
    }

    async function salvarEdicao(id) {
        await window.api.setores.editar(id, editNome, Number(editPercentual));
        setEditandoId(null);
        onAtualizar();
    }

    async function ativar(id) {
        await window.api.setores.ativar(id);
        onAtualizar();
    }

    return (
        <div>
            <h3>Setores Cadastrados</h3>

            <ul>
                {setores.map(([id, nome, percentual, isMeritocracia, ativo]) => (
                    <li key={id} style={{ marginBottom: 10 }}>
                        {editandoId === id ? (
                            <div>
                                <input
                                    value={editNome}
                                    onChange={(e) => setEditNome(e.target.value)}
                                />
                                <input
                                    type="number"
                                    value={editPercentual}
                                    onChange={(e) => setEditPercentual(e.target.value)}
                                />

                                <button onClick={() => salvarEdicao(id)}>Salvar</button>
                                <button onClick={() => setEditandoId(null)}>Cancelar</button>
                            </div>
                        ) : (
                            <>
                                <strong
                                    style={{
                                        color: ativo === 1 ? "#000" : "#999"
                                    }}
                                >
                                    {nome}
                                    {isMeritocracia === 1 && (
                                        <span style={{ color: "gold", marginLeft: 6 }}>
                                            ⭐ (Meritocracia)
                                        </span>
                                    )}
                                </strong>
                                — {percentual}%
                                {ativo === 1 ? (
                                    <>
                                        <button
                                            style={{ marginLeft: 10 }}
                                            onClick={() => iniciarEdicao(id, nome, percentual)}
                                        >
                                            Editar
                                        </button>

                                        {isMeritocracia === 0 && (
                                            <button
                                                style={{ marginLeft: 10 }}
                                                onClick={() => onExcluir(id)}
                                            >
                                                Inativar
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <button style={{ marginLeft: 10 }} onClick={() => ativar(id)}>
                                        Ativar
                                    </button>
                                )}
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
