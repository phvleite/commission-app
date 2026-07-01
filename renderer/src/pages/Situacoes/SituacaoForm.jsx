import { useState, useEffect } from "react";
import { useToast } from "../../components/ToastContext.jsx"; // ⭐ IMPORTAR AQUI

export default function SituacaoForm({ colaboradores, tipos, onSubmit }) {
    const { addToast } = useToast(); // ⭐ USAR AQUI, DENTRO DO COMPONENTE
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
        <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
            <h3>Nova Situação</h3>

            <div>
                <label>Data inicial:</label>
                <input
                    type="date"
                    value={dataInicial}
                    onChange={(e) => handleDataInicialChange(e.target.value)}
                />
            </div>

            <div>
                <label>Data final:</label>
                <input
                    type="date"
                    value={dataFinal}
                    onChange={(e) => setDataFinal(e.target.value)}
                />
            </div>

            <div>
                <label>Colaborador:</label>
                <select value={colaboradorId} onChange={(e) => setColaboradorId(e.target.value)}>
                    <option value="">Selecione...</option>
                    {colaboradores.map(([id, nome]) => (
                        <option key={id} value={id}>
                            {nome}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>Tipo de situação:</label>
                <select value={tipoId} onChange={(e) => setTipoId(e.target.value)}>
                    <option value="">Selecione...</option>
                    {tipos.map(([id, descricao]) => (
                        <option key={id} value={id}>
                            {descricao}
                        </option>
                    ))}
                </select>
            </div>

            <button style={{ marginTop: 10 }}>Cadastrar</button>
        </form>
    );
}
