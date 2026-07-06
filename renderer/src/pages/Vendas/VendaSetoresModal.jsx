import { useEffect, useState } from "react";
import { formatCurrencyFromDatabase } from "../../utils/formatCurrency";
import { formatDateFromDatabase } from "../../utils/formatDate";

export default function VendaSetoresModal({ data, onClose }) {
    const [setores, setSetores] = useState([]);

    useEffect(() => {
        async function carregar() {
            // GARANTE QUE A DATA ESTÁ NO FORMATO DO BANCO
            const dataBanco = data.includes("/") 
                ? data.split("/").reverse().join("-") 
                : data;

            const lista = await window.api.comissoes.listarSetoresPorDia(dataBanco);
            setSetores(lista);
        }
        carregar();
    }, [data]);

    return (
        <div className="venda-modal-overlay">
            <div className="venda-modal-card">

                <h3>Comissões por Setor — {formatDateFromDatabase(data)}</h3>
                <hr />

                <table className="venda-modal-table">
                    <thead>
                        <tr>
                            <th>Setor</th>
                            <th>Percentual</th>
                            <th>Valor Total</th>
                            <th>Total Colaboradores</th>
                            <th>Aptos</th>
                        </tr>
                    </thead>

                    <tbody>
                        {setores.map((s) => (
                            <tr key={s.id}>
                                <td>{s.setor}</td>
                                <td>{s.percentual_aplicado}%</td>
                                <td>R$ {formatCurrencyFromDatabase(s.valor_total_setor)}</td>
                                <td>{s.qtd_total_colaboradores}</td>
                                <td>{s.qtd_aptos_colaboradores}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="venda-modal-actions">
                    <button className="btn-secondary" onClick={onClose}>
                        Fechar
                    </button>
                </div>

            </div>
        </div>
    );
}
