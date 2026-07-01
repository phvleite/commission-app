import { useState, useEffect } from "react";
import VendaForm from "./VendaForm.jsx";
import VendaList from "./VendaList.jsx";

export default function VendasPage() {
    const [vendas, setVendas] = useState([]);

    async function carregarVendas() {
        const lista = await window.api.vendas.listar();
        setVendas(lista);
    }

    useEffect(() => {
        carregarVendas();
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h2>Vendas</h2>

            <VendaForm onSave={carregarVendas} />

            <VendaList vendas={vendas} />
        </div>
    );
}
