import { useState, useEffect } from "react";
import { useToast } from "../../components/ToastContext.jsx";

export default function SituacaoForm({ colaboradores, tipos, onSubmit }) {
    const { addToast } = useToast();

    const [dataInicial, setDataInicial] = useState("");
    const [dataFinal, setDataFinal] = useState("");
    const [colaboradorId, setColaboradorId] = useState("");
    const [tipoId, setTipoId] = useState("");

    useEffect(() => {
        setDataInicial("");
        setDataFinal("");
        setColaboradorId("");
        setTipoId("");
    }, []);

    function handleDataInicialChange(value) {
        setDataInicial(value);

        if (!dataFinal || new Date(dataFinal) < new Date(value)) {
            setDataFinal(value);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (!dataInicial || !dataFinal || !colaboradorId || !tipoId) {
            addToast("Preencha todos os campos.", "error");
            return;
        }

        if (new Date(dataFinal) < new Date(dataInicial)) {
            addToast("A data final não pode ser menor que a inicial.", "error");
            return;
        }

        onSubmit(dataInicial, dataFinal, Number(colaboradorId), Number(tipoId));

        setDataInicial("");
        setDataFinal("");
        setColaboradorId("");
        setTipoId("");

        addToast("Situação cadastrada com sucesso!", "success");
    }

    return (
        <form className="situ-form-card" onSubmit={handleSubmit}>
            <h3>Nova Situação</h3>

            <div className="situ-form-group">
                <label>Data inicial:</label>
                <input
                    type="date"
                    className="input"
                    value={dataInicial}
                    onChange={(e) => handleDataInicialChange(e.target.value)}
                />
            </div>

            <div className="situ-form-group">
                <label>Data final:</label>
                <input
                    type="date"
                    className="input"
                    value={dataFinal}
                    onChange={(e) => setDataFinal(e.target.value)}
                />
            </div>

            <div className="situ-form-group">
                <label>Colaborador:</label>
                <select
                    value={colaboradorId}
                    onChange={(e) => setColaboradorId(e.target.value)}
                >
                    <option value="">Selecione...</option>
                    {colaboradores.map(([id, nome]) => (
                        <option key={id} value={id}>
                            {nome}
                        </option>
                    ))}
                </select>
            </div>

            <div className="situ-form-group">
                <label>Tipo de situação:</label>
                <select
                    value={tipoId}
                    onChange={(e) => setTipoId(e.target.value)}
                >
                    <option value="">Selecione...</option>
                    {tipos.map(([id, descricao]) => (
                        <option key={id} value={id}>
                            {descricao}
                        </option>
                    ))}
                </select>
            </div>

            <button className="btn-primary situ-form-button">
                Cadastrar
            </button>
        </form>
    );
}
