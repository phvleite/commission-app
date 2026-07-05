import { useState } from "react";
import { useToast } from "../../components/ToastContext";

export default function ColaboradorForm({ setores, onSubmit, onCancel }) {
    const { addToast } = useToast();

    const [nome, setNome] = useState("");
    const [setorId, setSetorId] = useState("");
    const [dataAdmissao, setDataAdmissao] = useState("");
    const [dataDemissao, setDataDemissao] = useState("");

    function limparCampos() {
        setNome("");
        setSetorId("");
        setDataAdmissao("");
        setDataDemissao("");
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (!nome.trim()) {
            addToast("Informe o nome do colaborador.", "error");
            return;
        }

        if (!setorId) {
            addToast("Selecione um setor.", "error");
            return;
        }

        if (!dataAdmissao) {
            addToast("Informe a data de admissão.", "error");
            return;
        }

        if (dataDemissao && new Date(dataDemissao) < new Date(dataAdmissao)) {
            addToast("A data de demissão não pode ser menor que a admissão.", "error");
            return;
        }

        onSubmit({
            nome: nome.trim(),
            setorId: Number(setorId),
            dataAdmissao,
            dataDemissao: dataDemissao || null
        });

        limparCampos();
        addToast("Colaborador cadastrado com sucesso!", "success");
    }

    function cancelar() {
        limparCampos();
        if (onCancel) onCancel();
    }

    return (
        <form onSubmit={handleSubmit} className="form-card-inner">

            <h3>Novo Colaborador</h3>

            {/* Nome */}
            <div className="form-group">
                <label>Nome:</label>
                <input
                    className="input"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: João Silva"
                />
            </div>

            {/* Setor */}
            <div className="form-group">
                <label>Setor:</label>
                <div className="select-wrapper">
                    <select
                        value={setorId}
                        onChange={(e) => setSetorId(e.target.value)}
                    >
                        <option value="">Selecione...</option>
                        {setores.map(([id, nome]) => (
                            <option key={id} value={id}>
                                {nome}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Admissão */}
            <div className="form-group">
                <label>Data de admissão:</label>
                <input
                    type="date"
                    className="input"
                    value={dataAdmissao}
                    onChange={(e) => setDataAdmissao(e.target.value)}
                />
            </div>

            {/* Demissão */}
            <div className="form-group">
                <label>Data de demissão (opcional):</label>
                <input
                    type="date"
                    className="input"
                    value={dataDemissao}
                    onChange={(e) => setDataDemissao(e.target.value)}
                />
            </div>

            {/* Botões */}
            <div className="form-buttons">
                <button type="submit" className="btn-primary">
                    Cadastrar
                </button>

                <button type="button" className="btn-secondary" onClick={cancelar}>
                    Cancelar
                </button>
            </div>

        </form>
    );
}
