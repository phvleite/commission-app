import { useState } from "react";
import { formatCurrencyFromDatabase } from "../../utils/formatCurrency";
import { formatDateFromDatabase } from "../../utils/formatDate";
import VendaSetoresModal from "./VendaSetoresModal.jsx";

export default function VendaList({ vendas, onEdit }) {
    const [modalData, setModalData] = useState(null);

    return (
        <div className="venda-list-card">
            <h3>Histórico de Vendas</h3>

            <div className="venda-header">
                <span>Data</span>
                <span>Valor da Venda</span>
                <span>Comissão Total</span>
                <span>Ações</span>
            </div>

            {vendas.map((v) => (
                <div key={v.id} className="venda-card">
                    <span>{formatDateFromDatabase(v.data)}</span>
                    <span>R$ {formatCurrencyFromDatabase(v.valor)}</span>
                    <span>R$ {formatCurrencyFromDatabase(v.valor_comissao_total)}</span>

                    <div className="venda-card-actions">
                        <button className="btn-primary" onClick={() => setModalData(v.data)}>
                            Ver Setores
                        </button>

                        <button className="btn-secondary" onClick={() => onEdit(v.id)}>
                            Alterar
                        </button>
                    </div>
                </div>
            ))}

            {modalData && <VendaSetoresModal data={modalData} onClose={() => setModalData(null)} />}
        </div>
    );
}
