import { useState, useEffect } from "react";
import VendaForm from "./VendaForm.jsx";
import VendaList from "./VendaList.jsx";

export default function VendasPage() {
    const [vendas, setVendas] = useState([]);
    const [editId, setEditId] = useState(null);
    const [filtroMes, setFiltroMes] = useState("");
    const [filtroAno, setFiltroAno] = useState("");

    async function carregarVendas() {
        const lista = await window.api.vendas.listar();
        setVendas(lista);
    }

    useEffect(() => {
        carregarVendas();
    }, []);

    const vendasFiltradas = vendas.filter((v) => {
        const [ano, mes] = v.data.split("-");

        if (filtroMes && mes !== filtroMes) return false;
        if (filtroAno && ano !== filtroAno) return false;

        return true;
    });

    const anoAtual = new Date().getFullYear();
    const anos = [];

    for (let ano = 2020; ano <= anoAtual + 5; ano++) {
        anos.push(ano);
    }

    return (
        <div>
            <VendaForm
                vendaId={editId}
                onSave={(resultado) => {
                    setEditId(null); // limpa o formulário
                    carregarVendas();
                }}
                onCancel={() => {
                    setEditId(null);
                }}
            />

            <hr />

            <div className="situ-filters">

                <div className="situ-filter-group">
                    <label>Mês:</label>
                    <select value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)}>
                        <option value="">Todos</option>
                        <option value="01">Janeiro</option>
                        <option value="02">Fevereiro</option>
                        <option value="03">Março</option>
                        <option value="04">Abril</option>
                        <option value="05">Maio</option>
                        <option value="06">Junho</option>
                        <option value="07">Julho</option>
                        <option value="08">Agosto</option>
                        <option value="09">Setembro</option>
                        <option value="10">Outubro</option>
                        <option value="11">Novembro</option>
                        <option value="12">Dezembro</option>
                    </select>
                </div>

                <div className="situ-filter-group">
                    <label>Ano:</label>
                    <select value={filtroAno} onChange={(e) => setFiltroAno(e.target.value)}>
                        <option value="">Todos</option>
                        {anos.map((ano) => (
                            <option key={ano} value={ano}>{ano}</option>
                        ))}
                    </select>
                </div>

                <div className="situ-filter-group">
                    <button
                        className="btn-secondary"
                        style={{ marginTop: 26 }}
                        onClick={() => {
                            setFiltroMes("");
                            setFiltroAno("");
                        }}
                    >
                        Limpar Filtros
                    </button>
                </div>        

            </div>

            <hr />

            <VendaList
                vendas={vendasFiltradas}
                onEdit={(id) => setEditId(id)}
            />
        </div>
    );
}
