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
        <div className="list-card">
            <h3>Lista de Colaboradores</h3>

            <ul className="list">
                {colaboradores.map((col) => (
                    <li key={col.id} className="list-item">

                        {editId === col.id ? (
                            <div className="edit-row">

                                <div className="edit-left">
                                    <input
                                        className="input"
                                        value={editNome}
                                        onChange={(e) => setEditNome(e.target.value)}
                                    />

                                    <select
                                        className="input"
                                        value={editSetor}
                                        onChange={(e) => setEditSetor(e.target.value)}
                                    >
                                        {setores.map(([sid, snome]) => (
                                            <option key={sid} value={sid}>
                                                {snome}
                                            </option>
                                        ))}
                                    </select>

                                    <input
                                        type="date"
                                        className="input"
                                        value={formatDateFromDatabase(editAdmissao)}
                                        onChange={(e) => setEditAdmissao(e.target.value)}
                                    />

                                    <input
                                        type="date"
                                        className="input"
                                        value={formatDateFromDatabase(editDemissao)}
                                        onChange={(e) => setEditDemissao(e.target.value)}
                                    />
                                </div>

                                <div className="edit-right">
                                    <button className="btn-primary" onClick={salvar}>
                                        Salvar
                                    </button>

                                    <button
                                        className="btn-secondary"
                                        onClick={() => setEditId(null)}
                                    >
                                        Cancelar
                                    </button>
                                </div>

                            </div>

                        ) : (
                            <div className="colab-row">

                                <div className="colab-left">
                                    <div className="colab-name">{col.nome}</div>

                                    <div className="colab-sector">{col.setor_nome}</div>

                                    <div
                                        className={
                                            col.data_demissao
                                                ? "colab-status text-danger"
                                                : "colab-status text-success"
                                        }
                                    >
                                        {status(col)}
                                        {col.data_demissao
                                            ? ` (${formatDateFromDatabase(col.data_demissao)})`
                                            : ""}
                                    </div>
                                </div>

                                <div className="colab-right">
                                    <button
                                        className="btn-primary"
                                        onClick={() => iniciarEdicao(col)}
                                    >
                                        Editar
                                    </button>
                                </div>

                            </div>
                        )}

                    </li>
                ))}
            </ul>
        </div>
    );
}
