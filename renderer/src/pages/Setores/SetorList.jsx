import React, { useState } from "react";

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
        <div className="list-card">
            <h3>Setores Cadastrados</h3>

            <ul className="list">
                {setores.map(([id, nome, percentual, isMeritocracia, ativo]) => (
                    <li key={id} className="list-item">
                        {editandoId === id ? (
                            <div className="edit-row">
                                <input
                                    value={editNome}
                                    onChange={(e) => setEditNome(e.target.value)}
                                    className="input"
                                />
                                <input
                                    type="number"
                                    value={editPercentual}
                                    onChange={(e) => setEditPercentual(e.target.value)}
                                    className="input"
                                />

                                <button className="btn-primary" onClick={() => salvarEdicao(id)}>
                                    Salvar
                                </button>
                                <button className="btn-secondary" onClick={() => setEditandoId(null)}>
                                    Cancelar
                                </button>
                            </div>
                        ) : (
                            <>
                                <strong className={ativo === 1 ? "text-normal" : "text-muted"}>
                                    {nome}
                                    {isMeritocracia === 1 && (
                                        <span className="text-gold"> ⭐ Meritocracia</span>
                                    )}
                                </strong>

                                <span className="percent">{percentual}%</span>

                                {ativo === 1 ? (
                                    <>
                                        <button
                                            className="btn-primary"
                                            onClick={() => iniciarEdicao(id, nome, percentual)}
                                        >
                                            Editar
                                        </button>

                                        {isMeritocracia === 0 && (
                                            <button
                                                className="btn-danger"
                                                onClick={() => onExcluir(id)}
                                            >
                                                Inativar
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <button className="btn-primary" onClick={() => ativar(id)}>
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
