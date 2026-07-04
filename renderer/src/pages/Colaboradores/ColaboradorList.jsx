import { useState } from "react";
import { formatDateFromDatabase } from "../../utils/formatDate";

export default function ColaboradorList({
    colaboradores,
    setores,
    onEditar
}) {
    const [editId, setEditId] = useState(null);
    const [editNome, setEditNome] = useState("");
    const [editSetor, setEditSetor] = useState("");
    const [editAdmissao, setEditAdmissao] = useState("");
    const [editDemissao, setEditDemissao] = useState("");

    function iniciarEdicao(colaborador) {
        setEditId(colaborador.id);
        setEditNome(colaborador.nome);
        setEditSetor(colaborador.setor_id);
        setEditAdmissao(colaborador.data_admissao);
        setEditDemissao(colaborador.data_demissao || "");
    }

    function salvar() {
        onEditar(editId, {
            nome: editNome.trim(),
            setorId: Number(editSetor),
            dataAdmissao: editAdmissao,
            dataDemissao: editDemissao || null
        });

        setEditId(null);
    }

    function status(colaborador) {
        if (colaborador.data_demissao) return "Demitido";
        return "Ativo";
    }

    return (
        <div>
            <h3>Lista de Colaboradores</h3>

            <ul>
                {colaboradores.map((col) => (
                    <li key={col.id} style={{ marginBottom: 15 }}>
                        {editId === col.id ? (
                            <div style={{ padding: 10, border: "1px solid #ccc" }}>
                                <div>
                                    <label>Nome:</label>
                                    <input
                                        value={editNome}
                                        onChange={(e) => setEditNome(e.target.value)}
                                    />
                                </div>

                                <div style={{ marginTop: 10 }}>
                                    <label>Setor:</label>
                                    <select
                                        value={editSetor}
                                        onChange={(e) => setEditSetor(e.target.value)}
                                    >
                                        {setores.map(([sid, snome]) => (
                                            <option key={sid} value={sid}>
                                                {snome}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ marginTop: 10 }}>
                                    <label>Data de admissão:</label>
                                    <input
                                        type="date"
                                        value={formatDateFromDatabase(editAdmissao)}
                                        onChange={(e) => setEditAdmissao(e.target.value)}
                                    />
                                </div>

                                <div style={{ marginTop: 10 }}>
                                    <label>Data de demissão (opcional):</label>
                                    <input
                                        type="date"
                                        value={formatDateFromDatabase(editDemissao)}
                                        onChange={(e) => setEditDemissao(e.target.value)}
                                    />
                                </div>

                                <button style={{ marginTop: 10 }} onClick={salvar}>
                                    Salvar
                                </button>
                                <button
                                    style={{ marginLeft: 10 }}
                                    onClick={() => setEditId(null)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        ) : (
                            <>
                                <strong>{col.nome}</strong>
                                {" — "}
                                <span>{col.setor_nome}</span>
                                {" — "}
                                <span>
                                    {status(col)}
                                    {col.data_demissao
                                        ? ` (demitido em ${formatDateFromDatabase(col.data_demissao)})`
                                        : ""}
                                </span>

                                <button
                                    style={{ marginLeft: 10 }}
                                    onClick={() => iniciarEdicao(col)}
                                >
                                    Editar
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
