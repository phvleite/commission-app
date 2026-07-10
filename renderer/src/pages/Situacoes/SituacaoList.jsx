import { useState } from "react";
import { formatDateFromDatabase } from "../../utils/formatDate";

export default function SituacaoList({
    situacoes,
    colaboradores,
    tipos,
    onEditar,
    onAtivar,
    onInativar
}) {
    const [editId, setEditId] = useState(null);
    const [editDataInicial, setEditDataInicial] = useState("");
    const [editDataFinal, setEditDataFinal] = useState("");
    const [editColaborador, setEditColaborador] = useState("");
    const [editTipo, setEditTipo] = useState("");

    function iniciarEdicao(s) {
        setEditId(s[0]);
        setEditDataInicial(normalizarData(s[1]));
        setEditDataFinal(normalizarData(s[2]));
        setEditColaborador(s[3]);
        setEditTipo(s[5]);
    }

    function salvar() {
        onEditar(
            editId,
            editDataInicial,
            editDataFinal,
            Number(editColaborador),
            Number(editTipo)
        );
        setEditId(null);
    }

    function formatarData(data) {
        if (!data) return "";
        const [ano, mes, dia] = data.split("-");
        return `${dia}/${mes}/${ano}`;
    }

    function normalizarData(data) {
        if (!data) return "";
        if (data.includes("/")) {
            const [dia, mes, ano] = data.split("/");
            return `${ano}-${mes}-${dia}`;
        }
        return data;
    }

    return (
        <div className="situ-list-card">
            <h3>Situações</h3>

            {situacoes.map((s) => {
                const [
                    id,
                    dataIni,
                    dataFim,
                    colabId,
                    colabNome,
                    tipoId,
                    tipoDesc,
                    ativo
                ] = s;

                // ============================
                // MODO EDIÇÃO
                // ============================
                if (editId === id) {
                    return (
                        <div
                            key={id}
                            className={`situ-card ${tipoDesc.toLowerCase()}`}
                        >

                            {/* BLOCO 1 — Datas */}
                            <div className="situ-edit-block">
                                <div className="situ-edit-group">
                                    <label>Data inicial:</label>
                                    <input
                                        type="date"
                                        value={editDataInicial}
                                        onChange={(e) => setEditDataInicial(e.target.value)}
                                    />
                                </div>

                                <div className="situ-edit-group">
                                    <label>Data final:</label>
                                    <input
                                        type="date"
                                        value={editDataFinal}
                                        onChange={(e) => setEditDataFinal(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* BLOCO 2 — Colaborador + Tipo */}
                            <div className="situ-edit-block">
                                <div className="situ-edit-group">
                                    <label>Colaborador:</label>
                                    <select
                                        value={editColaborador}
                                        onChange={(e) => setEditColaborador(e.target.value)}
                                    >
                                        {colaboradores.map(([cid, cnome]) => (
                                            <option key={cid} value={cid}>{cnome}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="situ-edit-group">
                                    <label>Tipo de situação:</label>
                                    <select
                                        value={editTipo}
                                        onChange={(e) => setEditTipo(e.target.value)}
                                    >
                                        {tipos.map(([tid, tdesc]) => (
                                            <option key={tid} value={tid}>{tdesc}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* BLOCO 3 — Botões */}
                            <div className="situ-edit-actions">
                                <button className="btn-primary" onClick={salvar}>Salvar</button>
                                <button className="btn-secondary" onClick={() => setEditId(null)}>Cancelar</button>
                            </div>

                        </div>
                    );
                }

                // ============================
                // MODO VISUAL (CARD PREMIUM)
                // ============================
                return (
                    <div
                        key={id}
                        className={`situ-card ${tipoDesc.toLowerCase()}`}
                    >
                        <div className="situ-left">
                            <span className="situ-colab">{colabNome}</span>

                            <span className="situ-info">
                                {tipoDesc} — {formatarData(dataIni)} até {formatarData(dataFim)}
                            </span>
                        </div>

                        <div className="situ-right">
                            <button
                                className="btn-primary"
                                onClick={() => iniciarEdicao(s)}
                            >
                                Editar
                            </button>

                            {ativo ? (
                                <button
                                    className="btn-danger"
                                    onClick={() => onInativar(id)}
                                >
                                    Inativar
                                </button>
                            ) : (
                                <button
                                    className="btn-primary"
                                    onClick={() => onAtivar(id)}
                                >
                                    Ativar
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
