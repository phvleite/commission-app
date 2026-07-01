import { useState } from "react";
import { useToast } from "../../components/ToastContext";

export default function ColaboradorForm({ setores, onSubmit }) {
    const { addToast } = useToast();

    const [nome, setNome] = useState("");
    const [setorId, setSetorId] = useState("");
    const [dataAdmissao, setDataAdmissao] = useState("");
    const [dataDemissao, setDataDemissao] = useState("");

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

        setNome("");
        setSetorId("");
        setDataAdmissao("");
        setDataDemissao("");

        addToast("Colaborador cadastrado com sucesso!", "success");
    }

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
            <h3>Novo Colaborador</h3>

            <div>
                <label>Nome:</label>
                <input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: João Silva"
                />
            </div>

            <div style={{ marginTop: 10 }}>
                <label>Setor:</label>
                <select value={setorId} onChange={(e) => setSetorId(e.target.value)}>
                    <option value="">Selecione...</option>
                    {setores.map(([id, nome]) => (
                        <option key={id} value={id}>
                            {nome}
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ marginTop: 10 }}>
                <label>Data de admissão:</label>
                <input
                    type="date"
                    value={dataAdmissao}
                    onChange={(e) => setDataAdmissao(e.target.value)}
                />
            </div>

            <div style={{ marginTop: 10 }}>
                <label>Data de demissão (opcional):</label>
                <input
                    type="date"
                    value={dataDemissao}
                    onChange={(e) => setDataDemissao(e.target.value)}
                />
            </div>

            <button style={{ marginTop: 10 }}>Cadastrar</button>
        </form>
    );
}
