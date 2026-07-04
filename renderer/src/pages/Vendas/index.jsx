import { useState, useEffect } from "react";
import VendaForm from "./VendaForm.jsx";
import VendaList from "./VendaList.jsx";

export default function VendasPage() {
    const [vendas, setVendas] = useState([]);
    const [editId, setEditId] = useState(null);

    async function carregarVendas() {
        const lista = await window.api.vendas.listar();
        setVendas(lista);
    }

    useEffect(() => {
        carregarVendas();
    }, []);

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

            <VendaList
                vendas={vendas}
                onEdit={(id) => setEditId(id)}
            />
        </div>
    );
}
