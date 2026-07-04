import { useState } from "react";
import { formatCurrencyFromDatabase } from "../../utils/formatCurrency";
import { formatDateFromDatabase } from "../../utils/formatDate";
import VendaSetoresModal from "./VendaSetoresModal.jsx";

export default function VendaList({ vendas, onEdit }) {
    const [modalData, setModalData] = useState(null);

    return (
        <div>
            <h3>Histórico de Vendas</h3>

            <table border="1" cellPadding="6" style={{ width: "100%", marginTop: 10 }}>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Valor da Venda</th>
                        <th>Comissão Total</th>
                        <th>Detalhes por Setor</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>
                    {vendas.map((v) => (
                        <tr key={v.id}>
                            <td>{formatDateFromDatabase(v.data)}</td>
                            <td>R$ {formatCurrencyFromDatabase(v.valor)}</td>
                            <td>R$ {formatCurrencyFromDatabase(v.valor_comissao_total)}</td>

                            <td>
                                <button onClick={() => setModalData(v.data)}>
                                    Ver Setores
                                </button>
                            </td>

                            <td>
                                <button onClick={() => onEdit(v.id)}>
                                    Alterar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {modalData && (
                <VendaSetoresModal
                    data={modalData}
                    onClose={() => setModalData(null)}
                />
            )}
        </div>
    );
}
