import { useState } from "react";
import ComissaoList from "./ComissaoList.jsx";
import { useToast } from "../../components/ToastContext.jsx";

export default function ComissoesPage() {
    const [data, setData] = useState("");
    const [comissoes, setComissoes] = useState([]);
    const [setores, setSetores] = useState([]);
    const [venda, setVenda] = useState(null);

    const { addToast } = useToast();

    async function buscar() {
        if (!data) {
            addToast("Selecione uma data.", "error");
            return;
        }

        const lista = await window.api.comissoes.listarPorDia(data);
        const listaSetores = await window.api.comissoes.listarSetoresPorDia(data);
        const vendaDoDia = await window.api.vendas.buscarPorData(data);

        setComissoes(lista);
        setSetores(listaSetores);
        setVenda(vendaDoDia);

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

            <br /><br />

            <button onClick={buscar}>Buscar</button>

            <ComissaoList
                comissoes={comissoes}
                setores={setores}
                venda={venda}
                data={data}
            />
        </div>
    );
}
