import { useState } from "react";
import ComissaoList from "./ComissaoList.jsx";
import { useToast } from "../../components/ToastContext.jsx"; // ⭐ IMPORTAR AQUI

export default function ComissoesPage() {
    const [data, setData] = useState("");
    const [comissoes, setComissoes] = useState([]);
    const { addToast } = useToast(); // ⭐ USAR AQUI, DENTRO DO COMPONENTE

    async function buscar() {
        if (!data) {
            addToast("Selecione uma data.", "error");
            return;
        }

        const lista = await window.api.comissoes.listarPorDia(data);
        setComissoes(lista);

        if (lista.length === 0) {
            addToast("Nenhuma comissão encontrada.", "error");
        }
    }

    return (
        <div style={{ padding: 20 }}>
            <h2>Comissões</h2>

            <label>Data:</label>
            <br />
            <input type="date" value={data} onChange={(e) => setData(e.target.value)} />

            <br />
            <br />

            <button onClick={buscar}>Buscar</button>

            <ComissaoList comissoes={comissoes} data={data} />
        </div>
    );
}
