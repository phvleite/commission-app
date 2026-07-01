import { useState } from "react";

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
        onEditar(editId, editDataInicial, editDataFinal, Number(editColaborador), Number(editTipo));
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
        <ul style={{ marginTop: 20 }}>
            {situacoes.map((s) => {
                const [id, dataIni, dataFim, colabId, colabNome, tipoId, tipoDesc, ativo] = s;

                return (
                    <li key={id} style={{ marginBottom: 15 }}>
                        {editId === id ? (
                            <>
                                <input
                                    type="date"
                                    value={editDataInicial}
                                    onChange={(e) => setEditDataInicial(e.target.value)}
                                />

                                <input
                                    type="date"
                                    value={editDataFinal}
                                    onChange={(e) => setEditDataFinal(e.target.value)}
                                />

                                <select
                                    value={editColaborador}
                                    onChange={(e) => setEditColaborador(e.target.value)}
                                >
                                    {colaboradores.map(([cid, cnome]) => (
                                        <option key={cid} value={cid}>
                                            {cnome}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={editTipo}
                                    onChange={(e) => setEditTipo(e.target.value)}
                                >
                                    {tipos.map(([tid, tdesc]) => (
                                        <option key={tid} value={tid}>
                                            {tdesc}
                                        </option>
                                    ))}
                                </select>

                                <button onClick={salvar}>Salvar</button>
                                <button onClick={() => setEditId(null)}>Cancelar</button>
                            </>
                        ) : (
                            <>
                                <strong>{colabNome}</strong> — {tipoDesc}
                                <br />
                                <span>
                                    {formatarData(dataIni)} até {formatarData(dataFim)}
                                </span>
                                {ativo ? (
                                    <>
                                        <button
                                            onClick={() => iniciarEdicao(s)}
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
                );
            })}
        </ul>
    );
}
